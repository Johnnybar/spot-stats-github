const express = require('express');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

let secrets;
let client_id;
let client_secret;
let redirect_uri;
let client_url;
if (process.env.NODE_ENV != 'production') {
    secrets = require('./secrets.json');
    client_id = secrets.client_id;
    client_secret = secrets.client_secret;
    redirect_uri = secrets.redirect_uri;
    client_url = 'http://localhost:3000/#';
}
else{
    client_id =   process.env.CLIENT_ID; // Your client id
    client_secret =  process.env.CLIENT_SECRET; // Your secret
    redirect_uri = process.env.REDIRECT_URI; // Your redirect uri
    client_url = 'https://spot-stats.herokuapp.com/#';
}

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    console.log('this is state',state);//It's getting here
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email user-read-playback-state user-top-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});

app.get('/callback', function(req, res) {
  console.log('in callback');
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log('here storedstate and req query state ', storedState, req.query.state);

    if (state === null || state !== storedState) {
      console.log('in state === null', state);
        res.redirect('/#' +
      querystring.stringify({
          error: 'state_mismatch'
      }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
          console.log('in req post');
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect(client_url +
          querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
          }));
            } else {
                res.redirect('/#' +
          querystring.stringify({
              error: 'invalid_token'
          }));
            }
        });
    }
});
app.get('/refresh_token', function(req, res) {
  console.log('in refresh token');

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
