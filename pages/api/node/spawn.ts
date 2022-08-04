// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

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
  return [occupiedPorts[occupiedPorts.length - 1][0] + 1, occupiedPorts[occupiedPorts.length - 1][1] + 1]
}

async function spawnNewContainer(ports: any, tries?: number): Promise<String> {
  console.log(ports, tries)
  try {
    const { stdout } = await exec(`docker run -d -p ${ports[0]}:8080 -p ${ports[1]}:8090 ajan:latest`);
    return stdout
  } catch (e: any) {
    if(e.stderr.includes('port is already allocated')) {
      const id = e.stderr.match(/[a-z]*_[a-z]*/)[0];
      console.log(id)
      if(tries === undefined) {
        await exec(`docker stop ${id} || true && docker rm ${id} || true`);
        return await spawnNewContainer(await getNextPorts(), 1)
      } else if(tries !== 1) {
        await exec(`docker stop ${id} || true && docker rm ${id} || true`);
        return await spawnNewContainer(await getNextPorts(), tries + 1)
      }
    }
  }
    return 'error'
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let ports = await getNextPorts()
  let data  = await spawnNewContainer(ports)
  //console.log(data)
  res.status(200).json(data)
}
