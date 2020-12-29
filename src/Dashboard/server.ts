import http from "http";
import fs from "fs";
import path from "path";
const port: number = 3000;

http
  .createServer((req, res) => {
    let responseCode = 404;
    let content: string | Buffer = "404 Error";

    if (req.url === "/") {
      responseCode = 200;
      content = fs.readFileSync(path.join(__dirname, "index.html"));
    }

    res.writeHead(responseCode, {
      "content-type": "text/html;charset=utf-8",
    });

    res.write(content);
    res.end();
  })
  .listen(port, null, null, () => console.log(`Listening On Port ${port}`));
