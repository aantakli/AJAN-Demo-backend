import {NextApiRequest, NextApiResponse} from 'next';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("fetched data")
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");


  res.setHeader('Content-Type', 'text/turtle')

try {
  // @ts-ignore
  const uuid = req.query.uuid.toString()
  console.log("Fetched Data for ", uuid)

  // @ts-ignore
  res.status(200).send(global.dataMap.get(uuid));
} catch (e) {
  //console.log(e)
  res.status(404).send("No Data found")
}



}
