
import type {NextApiRequest, NextApiResponse} from 'next'
import {PortainerClient} from './PortainerClient';
import { v4 } from 'uuid';


async function getContainerData(portainer: PortainerClient) {

  await portainer.callApiWithKey('POST', '/api/endpoints/2/snapshot')
  // @ts-ignore
  let containerData = (await portainer.callApiWithKey('get', '/api/endpoints/2')).Snapshots[0].DockerSnapshotRaw.Containers;


  let containerList: any[] = []

  containerData.forEach((container: any) => {
    let knownPorts: any[] = [];
    if(container.Image){
      if(container.Image.includes('ajan-service')){
        var item:any = {}
        item.id = container.Id;
        item.created = container.Created;
        item.state = container.State
        let itemports: { PrivatePort: any; PublicPort: any; }[] = []
        if(item.state == 'running'){
          container.Ports.forEach( (port: any) => {
            if(!knownPorts.includes(port.PublicPort)){
              itemports.push({
                PrivatePort: port.PrivatePort,
                PublicPort: port.PublicPort
              })
              knownPorts.push(port.PublicPort)
            }
          })
          item.ports = itemports;
        }
        containerList.push(item)
      }
    }
  })
  return containerList;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const portainer = new PortainerClient("https://demo.yannic-hock.de", "admin", "HtZ&2niMmvSW2o$a");

  let ports: any[] = []
  let containerList: any[] = await getContainerData(portainer);
  containerList.forEach( container => {
    if(container.state == 'running'){
      container.ports.forEach((port: { PublicPort: any; }) => {
        ports.push(port.PublicPort)
      })
    }
  })

  ports.sort(function(a, b){return a-b});
  ports = ports.slice(0, Math.ceil(ports.length / 2));
  console.log(ports)

  if(ports.length == 0){
    ports.push(8079)
  }


  let uuid = v4();
  // @ts-ignore
  let data = {
    Image:"aantakli/ajan-service:latest",
    ExposedPorts: { "8080/tcp": {}, "8090/tcp": {} },
    Env: [
      `url=http://demo.yannic-hock.de:${(ports[ports.length-1]+1+100).toString()}/rdf4j`,
      `repoURL=http://demo.yannic-hock.de:${(ports[ports.length-1]+1+100).toString()}/rdf4j/repositories/`,
      "Dpf4j_mode=development",
      "DloadTTLFiles=true",
      `DpublicHostName=http://demo.yannic-hock.de:${(ports[ports.length-1]+1+100).toString()}`
    ],
    HostConfig:
      {
      "PortBindings": {
        "8080/tcp": [{ "HostPort": (ports[ports.length-1]+1).toString() }],
        "8090/tcp": [{ "HostPort": (ports[ports.length-1]+1+100).toString() }]
      },
      "Binds": [
        "/home/docker/ajan-service/" + uuid + "/data/logs:/logs",
      ]
    }
  }


  let createRes:any = await portainer.callApiWithKey('POST', '/api/endpoints/2/docker/containers/create', data)

  console.log("================================")
  console.log(createRes)
  console.log("================================")


  let id = createRes.Id

  let startRes:any = await portainer.callApiWithKey('POST', '/api/endpoints/2/docker/containers/' + createRes.Id + '/start')

  console.log(".................................")
  console.log(startRes)
  console.log(".................................")

  containerList = await getContainerData(portainer);

  let statuscode = 400;
  let resPorts:{workbench?: number, storage?: number} = {}
  containerList.forEach((container) => {
    if(container.id == id){
      if(container.state == 'running'){
        container.ports.forEach((port: { PublicPort: number; PrivatePort: number; }) => {
          if(port.PrivatePort == 8090){
            resPorts.workbench = port.PublicPort;
          } else if(port.PrivatePort == 8080){
            resPorts.storage = port.PublicPort;
          }
        })
        statuscode = 200;
      }
}
})
  //res.status(startRes.status).json(startRes.body)
  res.status(statuscode).json(resPorts)
}
