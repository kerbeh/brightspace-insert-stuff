const http = require("http");
const url = require("url");
const giphy = require("giphy-api")({
  https: true,
});

//Create the HTTP Server
const app = http.createServer(function(req, res) {

  searchGiphy(req, res);

 });

function searchGiphy(req, res){

  //Get the search keyword from the url query
  const keyword = url.parse(req.url, true).query.keyword;

  //Set the Server response to type JSON
  res.setHeader("Content-Type", "application/json");

  //Setup the giphy Query as a promise
  giphy.search(keyword).then(function(json) {

    return json.data.map((gif) => {

   //   if (Object.keys(gif.images.preview_gif).length !== 0) {
        return {
          downsized: gif.images.downsized,
          preview: gif.images.preview_gif,
          title: gif.title
       }
     // }

    });

  }).then((json => {
    //Send the response
    res.end(JSON.stringify({ json }));
  }))
  .catch(message => {
    //Show a message if an error occured
    res.end(JSON.stringify({ Message: message }));
  } );

}

app.listen(3000);

