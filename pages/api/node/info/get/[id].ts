import path from 'path';

const fs = require('fs')

export default (req: any, res: any) => {


  const { id } = req.query
  const { port } = req.query

  const jsonPath = path.join(__dirname, '..', 'messages.json');

  res.writeHead(200, {
    "connection": "keep-alive",
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
  });
  /* https://github.com/expressjs/compression#server-sent-events
    Because of the nature of compression this module does not work out of the box with
    server-sent events. To compress content, a window of the output needs to be
    buffered up in order to get good compression. Typically, when using server-sent
    events, there are certain block of data that need to reach the client.

    You can achieve this by calling res.flush() when you need the data written to
    actually make it to the client.
*/
  // Data which will write in a file.
  setInterval(() => {
    let data = 'null'
    try {
      try {
        data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      } catch (e){
        fs.writeFileSync(jsonPath, "{}", 'utf-8');
      }
      let string = ""
      if(data != "null"){
        try {
          // @ts-ignore
          data[id].forEach((message: any) => {
            string += ", " + message
          })
          string = string.replace(", ", "")
        } catch (e){
          string = "null"
        }
      } else {
        string = "null"
      }
      console.log("String", string)
      res.write(`data: ${string} \n\n`)
      res.flush();
    } catch (e) {
      console.log(e)
      fs.writeFileSync(jsonPath, "{}", 'utf-8');
    }
  }, 1000);
};
