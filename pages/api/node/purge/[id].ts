import {NextApiRequest, NextApiResponse} from "next";


const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function removeContainer(id: any) {
  try {
    const { stdout, stderr } = await exec(`docker container stop ${id}`);
    const { stdout: stdout2, stderr: stderr2 } = await exec(`docker container rm ${id}`);
    return {statuscode: 200, message: stdout + stdout2}
  } catch (e) {
    return {statuscode: 500, message: "Something went wrong"}
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const resp = await removeContainer(id)
  //let data  = await spawnNewContainer(ports)
  //console.log(data)
  res.status(resp.statuscode).json(resp)
}
