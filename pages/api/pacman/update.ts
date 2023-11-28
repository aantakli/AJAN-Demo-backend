
import type {NextApiRequest, NextApiResponse} from 'next'

import rdf from "rdf-ext"


function sleep(ms: number | undefined) {
  return new Promise(val => setTimeout(val, ms));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  var message = "Not found"
  var status = 404



  if (req.method == "POST") {

    const contentType = req.headers['contenttype']
    //if (contentType && contentType.indexOf("application/json") !== -1)

      try {
        //console.log("Update Data")


        const json = JSON.parse(req.body);
        const data = json.data
        const uuid = json.uuid

        let dataset = rdf.dataset();
        data.forEach((item: any) => {
          let b1 = rdf.blankNode();
          dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo/type/'), rdf.literal(item.type)))
          dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo/type/'), rdf.literal(item.type)))
          if(item.desiredDirection)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo/desiredDirection/'), rdf.literal(item.desiredDirection)))
          if(item.direction)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo/direction/'), rdf.literal(item.direction)))
          if(item.moving)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo/moving/'), rdf.literal(item.moving.toString())))
          if(item.points)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo/points/'), rdf.literal(Math.round(item.points).toString())))
          let b2 = rdf.blankNode();
          dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo/position/'), b2))
          dataset.add(rdf.quad(b2, rdf.namedNode('http://ajan.demo/position/x/'), rdf.literal(Math.round(item.position.x).toString())))
          dataset.add(rdf.quad(b2, rdf.namedNode('http://ajan.demo/position/y/'), rdf.literal(Math.round(item.position.y).toString())))
        })
        // @ts-ignore
        let dataMap = global.dataMap
        if(!dataMap)
          dataMap = new Map();
        dataMap.set(uuid, dataset.toString());
        // @ts-ignore
        global.dataMap = dataMap

        // @ts-ignore
        let dirMap = global.dirMap
        if(!dirMap)
          dirMap = new Map();

        let dir = "right"
        dirMap.set(uuid, dir)
        // @ts-ignore
        global.dirMap = dirMap




        message = "ok"
        status = 200

        // @ts-ignore
        res.status(200).send({"direction": dir})
        return;
      } catch (e) {
        console.log(e);
        status = 400
        message = "Bad Request"
        // @ts-ignore
        res.send(400).json({"message": "Bad Request"})
      }
  } else if(req.method == "OPTIONS") {
    res.status(200).send("")
  }
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Set desired value here
    }
  }
}

