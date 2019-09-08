const http = require("http");
const url = require("url");
const giphy = require("giphy-api")({
  https: true,
  apiKey: "VQpVQhg2Byb56BpyrxHXT7vROYd0RjNr"
});

const app = http.createServer(function(req, res) {
  const query = url.parse(req.url, true).query;

  res.setHeader("Content-Type", "application/json");

  giphy.search(query.query).then(function(json) {
    res.end(JSON.stringify({ json }));
    // Res contains gif data!
  });
});
app.listen(3000);
