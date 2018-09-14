import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Home';
import List from './List';

import TopArtists from './top-artists';
// import TopTracks from './top-tracks';
import SpotifyWebApi from 'spotify-web-api-js';


const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    this.textInput = React.createRef();
    const params = this.getHashParams();
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.getMyTopArtists = this.getMyTopArtists.bind(this);
    this.getMyTopTracks = this.getMyTopTracks.bind(this);
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token
        ? true
        : false,
        term:'medium_term'
      // nowPlaying: {
      //   name: 'Not Checked',
      //   albumArt: ''
      // }
    }
  }
  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      if(response){
      this.setState({
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url
        },
        noNowPlaying:false
      })

    }
      else{
      this.setState({noNowPlaying:true})
    }
    }).catch(err => console.log(err))
  }
  getMyTopTracks(term, callback) {
    spotifyApi.getMyTopTracks({limit: 10, time_range: term}).then((response) => {
      this.setState({myTopTracks: response.items, myTopArtists:false}, callback)
    }).catch(err => console.log(err))
  }

getMyTopArtists(term, callback) {
    spotifyApi.getMyTopArtists({limit: 10, time_range: term}).then((response) => {
        this.setState({
    myTopArtists: response.items,
    myTopTracks:false,
    term: term,
}, callback);
    }).catch(err => console.log(err))
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/list' component={List}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
