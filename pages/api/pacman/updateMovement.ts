import {NextApiRequest, NextApiResponse} from 'next';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  console.log("movement data")

  const dir = req.body.split(" ")[5];

  //console.log(dir)

  // @ts-ignore
  let node = global.dirMap.get(req.query.uuid.toString())

  console.log(dir, node)

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

/*
 PREFIX type: <http://ajan.demo/type>
 PREFIX position: <http://ajan.demo/position>

 SELECT ?x ?y
 WHERE {
 ?pacman type: "Pacman" .
 ?pacman position: ?position .
 ?position position:x ?x .
 ?position position:y ?y .
 BIND(xsd:string(xsd:integer(?xO)) AS ?x) .
 BIND(xsd:string(xsd:integer(?yO)-96) AS ?y) .
 }
 */
