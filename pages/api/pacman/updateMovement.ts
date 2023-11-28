import {NextApiRequest, NextApiResponse} from 'next';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const dir = req.body.split(" ")[5];
  console.log("movement data", dir)
  //console.log(dir)

  // @ts-ignore
  let node = global.dirMap.get(req.query.uuid.toString())

  console.log("old", node)

  // @ts-ignore
  global.dirMap.set(req.query.uuid.toString(), dir)

  // @ts-ignore
  node = global.dirMap.get(req.query.uuid.toString())
  console.log("new", node)


  //res.setHeader('Content-Type', 'application/ld+json')

  // @ts-ignore
  res.status(200).send("");


}


//RESET QUERY
/*
 PREFIX demo: <http://ajan.demo/>
 DELETE { ?s ?p ?o }
 WHERE {
 {
 SELECT DISTINCT *
 WHERE {
 ?s ?p ?o .
 filter strstarts(str(?p),str(demo:))
 }
 }
 }
 */

/* Get Data
 SELECT (?o as ?requestURI)
 WHERE {
 ?s <http://pacman.demo/requestURIfetch> ?o
 }


 ASK
 WHERE {
 ?node <http://ajan.demo/type> "Pacman" .
 ?node <http://ajan.demo/direction> ?direction .
 FILTER (regex(?direction, '^left$')) .
 }
 */


// Get XY of Pacman
/*
 PREFIX type: <http://ajan.demo/type/>
 PREFIX position: <http://ajan.demo/position/>
 PREFIX x: <http://ajan.demo/position/x/>
 PREFIX y: <http://ajan.demo/position/y/>

 SELECT ?x ?y
 WHERE {
 ?pacman type: "Pacman" .
 ?pacman position: ?position .
 ?position x: ?x .
 ?position y: ?y .
 }

 // Get XY of all Pickups
 PREFIX type: <http://ajan.demo/type/>
 PREFIX position: <http://ajan.demo/position/>
 PREFIX x: <http://ajan.demo/position/x/>
 PREFIX y: <http://ajan.demo/position/y/>

 SELECT ?position ?x ?y
 WHERE {
 ?pickup type: "Pickup" .
 ?pickup position: ?position .
 ?position x: ?x .
 ?position y: ?y .
 }


 PREFIX type: <http://ajan.demo/type/>
 PREFIX position: <http://ajan.demo/position/>
 PREFIX x: <http://ajan.demo/position/x/>
 PREFIX y: <http://ajan.demo/position/y/>
 PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

 SELECT ?x ?y ?px ?py
 WHERE {
 ?pacman type: "Pacman" .
 ?pacman position: ?pacmanposition .
 ?pacmanposition x: ?x .
 ?pacmanposition y: ?y .

 ?pickup type: "Pickup" .
 ?pickup position: ?pickupposition .
 ?pickupposition x: ?px .
 ?pickupposition y: ?py .
 FILTER(xsd:integer(?px) = (xsd:integer(?x)-3)+16)
 }
 */
