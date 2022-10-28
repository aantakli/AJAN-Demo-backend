import axios from 'axios';

export default (req: any, res: any) => {


  const { id } = req.query
  const { port } = req.query

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
  setInterval(() => {
    res.write(`data: ${id} ${port} \n\n`)
    res.flush();
  }, 1000);
};
