// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
//import configJson from ',,/../../../../config.json';
import config from '../config.json';
//docker stop trusting_burnell || true && docker rm trusting_burnell || true

async function getRunningInfo() {
  const { stdout, stderr } = await exec("docker container ls -a");
  let runningContainers = stdout.split("\n")
  runningContainers.shift()
  runningContainers.pop()
  let running: any = []
  let occupiedPorts: any = []
  runningContainers.forEach((container: any) => {
    let infoArr = container.split(/\s{2,}/)
    if(infoArr[1].includes('ajan-service')) {
      let portsArr = infoArr[5].split(', ')
      let ports: any[] = []
      portsArr.forEach((portString: any) => {
        const port = parseInt(portString.split("->")[0].split(":")[1])
        ports.push(port)
      })
      occupiedPorts.push(ports)
      let sData = {
        name: infoArr[6],
        id: infoArr[0],
        ports: ports.toString()
      }
      running.push(sData)
    }
  })
  occupiedPorts.reverse()
  return {
    'runningContainer': running,
    'occupiedPorts': occupiedPorts
  }
}

async function getNextPorts(){
  const { occupiedPorts } = await getRunningInfo()
  return occupiedPorts.length != 0 ? [occupiedPorts[occupiedPorts.length - 1][0] + 1, occupiedPorts[occupiedPorts.length - 1][1] + 1] : [config.startPort_1, config.startPort_2]
}

async function startTimer(id: any){
  setTimeout(async () => {
    await exec(`docker stop ${id} || true && docker rm ${id} || true`);
  } , 1000*60*config.timeout)
}

async function spawnNewContainer(ports: any, tries?: number): Promise<any> {
  try {
    let { stdout } = await exec(`docker run -d -p ${ports[0]}:8080 -p ${ports[1]}:8090 aantakli/ajan-service:latest`);
    stdout = stdout.replace("\n", '').substring(0, 11)
    return {statuscode: 200, id: stdout, port: ports[1]}
  } catch (e: any) {
    if(e.stderr.includes('port is already allocated')) {
      let id = e.stderr.match(/[a-z]*_[a-z]*/)[0];
      id.replace("\n", '').substring(0, 11)
      if(tries  !== undefined) {
        if(tries >= 10){
          return {statuscode: 500, error: 'Too many tries'}
        }
        await exec(`docker stop ${id} || true && docker rm ${id} || true`);
        return await spawnNewContainer(await getNextPorts(), tries + 1)
      } else {
        await exec(`docker stop ${id} || true && docker rm ${id} || true`);
        return await spawnNewContainer(await getNextPorts(), 1)
      }
    }
  }
  return {statuscode: 500, message: 'Something went wrong'}
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let ports = await getNextPorts()
  let data  = await spawnNewContainer(ports)
  if(data.statuscode === 200){
    startTimer(data.id).then(r => {})
  }
  res.status(data.statuscode).json(data)
}
