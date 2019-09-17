const http = require("http");
const { parse } = require('querystring');
const fs = require('fs');
const helpers = require('./helpers');
const { join } = require('path');



//Create the HTTP Server
const app = http.createServer(function(req, res) {

  console.log(`https://${req.headers.host}`);

  let body ="";
  let postData ={};

  req.on('data', chunk => {
      body += chunk.toString();
  });
  req.on('end', () => {
     postData = parse(body);

  if (helpers.verifyLtiRequest(`https://${req.headers.host}`,postData,"secret")){

 fs.readFile( join(__dirname, './dist/index.html'), null, function (error, data) {
  if (error) {
      res.writeHead(404);
      res.write('Whoops! File not found!');
  } else {
      res.write(data);
      res.write(`<script>document.content_item_return_url = "${postData.content_item_return_url}"; console.log("Test");</script>`);
      res.write("</body></html>")
  }
  res.end();
});
  }else {
    notAuthorised(res, req);
  }
  });
 });

 app.listen(3000);

function notAuthorised(res, req){
  res.setHeader("Content-Type", "application/json");
  res.writeHead(401);
  res.end(JSON.stringify({ Message: "Unauthorised", Url: req.headers.host}));
}

