import {NextApiRequest, NextApiResponse} from 'next';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("fetched data")
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");


  res.setHeader('Content-Type', 'application/json')


  const PORTAINER_USERNAME = process.env.PORTAINER_USERNAME;
  const PORTAINER_PASSWORD = process.env.PORTAINER_PASSWORD;
  const PORTAINER_PORT = process.env.PORTAINER_PORT;
  const BASE_URL = process.env.BASE_URL;
  const EDITOR_PORT = process.env.EDITOR_PORT;
  const PACMAN_PORT = process.env.PACMAN_PORT;
  const BACKEND_PORT = process.env.BACKEND_PORT;
  const AGENT_UUID = process.env.AGENT_UUID;


  if(PORTAINER_USERNAME && PORTAINER_PASSWORD && PORTAINER_PORT && BASE_URL && EDITOR_PORT && PACMAN_PORT && BACKEND_PORT){
    res.status(200).send({
      PORTAINER_PORT: PORTAINER_PORT,
      BASE_URL: BASE_URL,
      EDITOR_PORT: EDITOR_PORT,
      PACMAN_PORT: PACMAN_PORT,
      BACKEND_PORT: BACKEND_PORT,
      AGENT_UUID: AGENT_UUID
    });
  } else {
    res.status(500).send("Missing Environment Variables")
    return;
  }

}
