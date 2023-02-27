const fs = require('fs')
const path = require('path');

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const { id } = req.query
  const { message } = req.query

  const jsonPath = path.join(__dirname, '..', 'messages.json');


  try {
    let data = fs.readFileSync(jsonPath, 'utf-8');

    let json = JSON.parse(data)
    // @ts-ignore
    if(json[id] == undefined) {
      // @ts-ignore
      json[id] = [message]
    } else {
      // @ts-ignore
      let messageArr = json[id]
      messageArr.push(message)
    }
    let updatedData = JSON.stringify(json)

    fs.writeFileSync(jsonPath, updatedData, "utf-8", );
  } catch (e){
    console.log(e)
    fs.writeFile(jsonPath, "{}", { flag: 'wx' }, function (err: any) {
      if (err) throw err;
    });
  }


  res.status(200).json({})
}
