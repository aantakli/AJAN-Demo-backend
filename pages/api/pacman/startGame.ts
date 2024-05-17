import {NextApiRequest, NextApiResponse} from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  console.log("Received new request to start a new Agent-Instance")
  if (req.method == "POST") {
    if(req.body){
      let json = await JSON.parse(req.body);
      const uuid = json.uuid;
      const WORKBENCH_PORT = json.workbench_Port;
      const STORAGE_PORT = json.storage_Port;
      const BASE_URL = process.env.BASE_URL;
      const BACKEND_PORT = process.env.BACKEND_PORT;
      const AGENT_UUID = process.env.AGENT_UUID;

      //http://192.168.178.139:8180/rdf4j/repositories/agents#AG_71fd7601-8244-48b1-bf76-5e4efbdf20b1

      const initData = "@prefix ajan: <http://www.ajan.de/ajan-ns#> .\n" +
          "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
          "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"+
          "@prefix requestURI: <http://pacman.demo/requestURI> .\n" +
          "@prefix ajan: <http://pacman.demo/requestURI> .\n" +
          "_:initAgent rdf:type ajan:AgentInitialisation ;\n" +
          "\t ajan:agentId \"" + uuid + "\" ;\n" +
          "\t ajan:agentTemplate <" + BASE_URL + ":" + WORKBENCH_PORT + "/rdf4j/repositories/agents#" + AGENT_UUID + "> ;\n" +
          "ajan:agentInitKnowledge [\n" +
          // ajan:agentReportURI "http://localhost:4202/report"%5E%5Exsd:anyURI ;
          "ajan:agentReportURI \"" + BASE_URL + ":4202/report\"^^xsd:anyURI;\n" +
          "requestURI:fetch \"" + BASE_URL  + ":" + BACKEND_PORT + "/api/pacman/fetch?uuid=" + uuid + "\"^^xsd:string ;\n" +
          "requestURI:updateMovement \"" + BASE_URL + ":" + BACKEND_PORT + "/api/pacman/updateMovement?uuid=" + uuid + "\"^^xsd:string ;\n" +
          "] ."

      console.log(BASE_URL + ":" + STORAGE_PORT + "/ajan/agents/")

      await fetch(BASE_URL + ":" + STORAGE_PORT + "/ajan/agents/", {
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

  } else if(req.method == "OPTIONS") {
    res.status(200).send("")
  }
}
