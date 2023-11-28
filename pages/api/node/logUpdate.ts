import type {NextApiRequest, NextApiResponse} from 'next'
import {PortainerClient} from './PortainerClient';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("Logrequest...");

    const id = req.query.id as string;
    const PORTAINER_USERNAME = process.env.PORTAINER_USERNAME;
    const PORTAINER_PASSWORD = process.env.PORTAINER_PASSWORD;
    const PORTAINER_PORT = process.env.PORTAINER_PORT;
    const BASE_URL = process.env.BASE_URL;

    if(PORTAINER_USERNAME && PORTAINER_PASSWORD && PORTAINER_PORT && BASE_URL){
        const portainer = new PortainerClient(`${BASE_URL}:${PORTAINER_PORT}`, PORTAINER_USERNAME, PORTAINER_PASSWORD);
        let containerData = await portainer.callApiWithKey('get', '/api/endpoints/2/docker/containers/' + id + '/logs?since=0&stderr=1&stdout=1&tail=100&timestamps=0')
        res.status(200).send(containerData)
        return
    }
    res.status(400).send("Error in Environment Variables")
}