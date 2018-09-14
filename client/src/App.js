import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import TopArtists from './top-artists';
import TopTracks from './top-tracks';
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
    // if (token) {
      spotifyApi.setAccessToken(token);
    // }
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
    let anchor;
     if (process.env.NODE_ENV != 'production') {
       anchor = 'http://www.localhost:5000/login'
     }
     else{
       anchor = 'https://react-express-j.herokuapp.com/login';
     }
     let artists;
     let tracks;
     if (this.state.myTopArtists) {
       artists = this.state.myTopArtists;
     }
     else if (this.state.myTopTracks) {
       tracks = this.state.myTopTracks;
     }



    return (
      <div className="app">
      <nav className='navbar navbar-light bg-light navbar-expand-lg fixed-top'>
        <a href="#" className="navbar-brand">Spot.Stats</a>
        <button className='navbar-toggler' data-toggle="collapse" data-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarCollapse'>
        <ul className="navbar-nav ml-auto">
              <li className="navbar-item">
                  <a href="#" className="nav-link">Home</a>
              </li>
              <li className="navbar-item">
                  <a href="#" className="nav-link">Contact</a>
              </li>
          </ul>
          </div>

      </nav>
      <br></br>
      <br></br>
      <br></br>
      { this.state.loggedIn === false  &&
        <a href={anchor}>
            Log In
        </a>}

          {this.state.noNowPlaying === true && <div>Nothing is playing at the moment</div>}
          {this.state.nowPlaying && this.state.noNowPlaying !== true && <div>
            Now Playing: {this.state.nowPlaying.name}s
            <img alt='album-art' src={this.state.nowPlaying.albumArt} style={{
                height: 100
              }}/>
          </div>}
          {
            this.state.loggedIn &&
              <div className='search-btns'>
                <button className='btn btn-primary' onClick ={() => this.getNowPlaying()}>
                  Check Now Playing</button>
                <button className='btn btn-primary' onClick ={() => this.getMyTopArtists(this.state.term)}>
                  Check Your 10 Top Artists Popularity</button>
                  <button  className='btn btn-primary' onClick ={() => this.getMyTopTracks(this.state.term)}>
                    Check Your 10 Top Tracks</button>
              </div>
          }
          {
            this.state.myTopArtists &&
            <React.Fragment>
            <TopArtists artists={artists} getMyTopArtists= {this.getMyTopArtists.bind(this)}/>
            </React.Fragment>
          }
          {
            this.state.myTopTracks &&
            <TopTracks tracks={tracks} getMyTopTracks= {this.getMyTopTracks.bind(this)}/>
          }
      </div>
    );
  }
}

export default App;