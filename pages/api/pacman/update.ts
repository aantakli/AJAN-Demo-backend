
import type {NextApiRequest, NextApiResponse} from 'next'

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
    if (contentType && contentType.indexOf("application/json") !== -1)

      try {
        const body = req.body;


        // TODO RDF Übersetzung hier
        console.log(JSON.parse(body));
        message = "ok"
        status = 200

      } catch (e) {
        //console.log(e);
        status = 400
        message = "Bad Request"
      }
  }

  //await sleep(3000);
  res.status(200).json({"message": message, "status": status})
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Set desired value here
    }
  }
}
