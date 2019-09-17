const http = require("http");
const { parse } = require('querystring');
const crypto = require('crypto');
const helpers = require('../helpers');
const     url = require('url');

//Create the HTTP Server
const app = http.createServer(function(req, res) {
  const queryParrams = url.parse(req.url,true).query;
  const contentItems = {
    '@context' : 'http://purl.imsglobal.org/ctx/lti/v1/ContentItem',
    '@graph': [
        {
            '@type' : 'ContentItem',
            mediaType: 'image/png',
            title: 'Giphy Animated Gif',
            text: queryParrams.title,
            url: queryParrams.image,
            placementAdvice : {
                displayWidth : queryParrams.width,
                displayHeight : queryParrams.height,
                presentationDocumentTarget : 'embed',
                windowTarget : '_blank'
            }
        }
    ]
};

const nonce = crypto.randomBytes(16).toString('base64');
const responseObject = {
    lti_message_type: 'ContentItemSelection',
    lti_version: 'LTI-1p0',
    content_items: JSON.stringify(contentItems),
    oauth_version: '1.0',
    oauth_nonce: nonce,
    oauth_timestamp: helpers.getUnixTimestamp(),
    oauth_consumer_key: 'TEST',
    oauth_callback: 'about:blank',
    oauth_signature_method: 'HMAC-SHA1'
};

responseObject.oauth_signature = helpers.generateAuthSignature(queryParrams.contentItemReturnUrl, responseObject, 'secret');
responseObject.lti_return_url = queryParrams.contentItemReturnUrl;

res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify(responseObject));
});

app.listen(3000);

