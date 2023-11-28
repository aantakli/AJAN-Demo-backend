import {NextApiRequest, NextApiResponse} from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");


  if(req.body){
    const uuid = req.body

    const initData = "@prefix ajan: <http://www.ajan.de/ajan-ns#> .\n" +
                              "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
                              "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"+
                              "@prefix requestURI: <http://pacman.demo/requestURI> \n." +
                              "_:initAgent rdf:type ajan:AgentInitialisation ;\n" +
                                "\t ajan:agentId \"" + uuid + "\" ;\n" +
                                "\t ajan:agentTemplate <http://localhost:8090/rdf4j/repositories/agents#AG_0a488da3-d0f9-470f-ad24-145c140b8f5b> ;\n" +
                              "ajan:agentInitKnowledge [\n" +
                                "requestURI:fetch \"http://192.168.178.139:3000/api/pacman/fetch?uuid=" + uuid + "\"^^xsd:string ;\n" +
                                "requestURI:updateMovement \"http://192.168.178.139:3000/api/pacman/updateMovement?uuid=" + uuid + "\"^^xsd:string ;\n" +
                              "] ."


    fetch("http://localhost:8080/ajan/agents/", {
      method: "POST",
      body: initData,
      headers: {
        "content-type": "text/turtle",
      },
    }).catch((e) => console.log(e));

    console.log('Created Agent: ' + uuid)
    res.status(200).send(uuid)
  } else {
    res.status(404).send("No Body found")
  }


}
