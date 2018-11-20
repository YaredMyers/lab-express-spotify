const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');
var SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials( __dirname + '/views/partials');


// Remember to paste your credentials here


var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (req, res) => {

  res.render('index')

});

app.get('/artist', (req, res) => {

  const {artist} = req.query;

  spotifyApi.searchArtists(artist)
  .then(data => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
   // console.log(data.body.artists.items[0].images[0].url)
    res.render('selectArtist', {data: data.body.artists.items});

   
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
    console.log(err)
  })
});

app.get('/albums/:artistId', (req, res) => {

  const id = req.params.artistId;
  
  spotifyApi.getArtistAlbums(id)
  .then(data => {
    // console.log(data.body.items[0].images[0].url)

    res.render('selectAlbums', {data: data.body.items});

    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
  })

});


app.get('/tracks/:albumId', (req, res) => {
  const id = req.params.albumId;

  console.log("tracks", id);

  spotifyApi.getAlbumTracks(id)
  .then(data => {
    console.log(data.body)

     res.render('selectTracks', {data: data.body.items});

    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
  })});


app.listen(3000);


