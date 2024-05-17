
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

        /*
PREFIX demo: <http://ajan.demo#>
PREFIX  xsd:  <http://www.w3.org/2001/XMLSchema#>

CONSTRUCT {
  <http://pacman.demo#movement> <http://pacman.demo#direction> ?direction .

  <http://pacman.demo#current> <http://pacman.demo#x> ?pacmanX .

  <http://pacman.demo#current> <http://pacman.demo#y> ?pacmanY .
}
WHERE {{
SELECT ?pacmanX ?pacmanY ?type ?x ?y
(ABS(
  xsd:integer(?x) - xsd:integer(?pacmanX)
  +
  xsd:integer(?y) - xsd:integer(?pacmanY)
) AS ?distance)
(IF(
  ABS(xsd:integer(?x) - xsd:integer(?pacmanX)) > ABS(xsd:integer(?y) - xsd:integer(?pacmanY)),
  IF(xsd:integer(?x) > xsd:integer(?pacmanX), "right", "left"),
  IF(xsd:integer(?y) > xsd:integer(?pacmanY), "down", "up")
) AS ?direction)
WHERE {
  {
    SELECT ?pacmanX ?pacmanY
    WHERE {
      ?pacman demo:type "Pacman" .
      ?pacman demo:position ?pacmanPosition .
      ?pacmanPosition demo:X ?pacmanX .
      ?pacmanPosition demo:Y ?pacmanY .
    }
    LIMIT 1
  }
  ?pickup demo:type "Pickup" .
  ?pickup demo:type ?type .
  ?pickup demo:position ?pickupposition .
  ?pickupposition demo:X ?x .
  ?pickupposition demo:Y ?y .
}
ORDER BY ?distance
LIMIT 1
}}


PREFIX demo: <http://ajan.demo#>

CONSTRUCT {
  <http://pacman.demo#movement> <http://pacman.demo#direction> ?newDirection .
}
WHERE {
  <http://pacman.demo#movement> <http://pacman.demo#direction> ?currentDirection .
  BIND(
    IF(?currentDirection = "up", "right",
      IF(?currentDirection = "right", "down",
        IF(?currentDirection = "down", "left",
          IF(?currentDirection = "left", "up", ?currentDirection)
        )
      )
    ) AS ?newDirection
  )
}

         */


        const json = JSON.parse(req.body);
        const data = json.data
        const uuid = json.uuid

        let dataset = rdf.dataset();
        const xsdInteger = rdf.namedNode('http://www.w3.org/2001/XMLSchema#integer');
        data.forEach((item: any) => {
          let b1 = rdf.blankNode();
          dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo#type'), rdf.literal(item.type)))
          dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo#type'), rdf.literal(item.type)))
          if(item.desiredDirection)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo#desiredDirection'), rdf.literal(item.desiredDirection)))
          if(item.direction)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo#direction'), rdf.literal(item.direction)))
          if(item.moving)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo#moving'), rdf.literal(item.moving.toString())))
          if(item.points)
            dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo#points'), rdf.literal(Math.round(item.points).toString())))
          let b2 = rdf.blankNode();
          dataset.add(rdf.quad(b1, rdf.namedNode('http://ajan.demo#position'), b2))
          dataset.add(rdf.quad(b2, rdf.namedNode('http://ajan.demo#X'), rdf.literal(item.position.x, xsdInteger)));
          dataset.add(rdf.quad(b2, rdf.namedNode('http://ajan.demo#Y'), rdf.literal(item.position.y, xsdInteger)));
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
        if(!dirMap){
          dirMap = new Map();

          let dir = "right"
          dirMap.set(uuid, dir)
          // @ts-ignore
          global.dirMap = dirMap
        }

        // @ts-ignore
        let dir = global.dirMap.get(uuid).replace(/[^A-Za-z]/g, '');
        const dirKeyMap = new Map([
          ["up", 38],
          ["down", 40],
          ["left", 37],
          ["right", 39]
        ])

        // @ts-ignore
        res.status(200).send({"direction":  dirKeyMap.get(dir).toString()})
        return;
      } catch (e) {
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

