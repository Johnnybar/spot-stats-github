import React, { Component } from 'react';
// import { Route, Switch } from 'react-router-dom';
import './App.css';
import AudioFeatures from './audio-features';
import TopArtists from './top-artists';
import TopTracks from './top-tracks';
import SpotifyWebApi from 'spotify-web-api-js';
import scrollIntoView from 'scroll-into-view';



const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    this.textInput = React.createRef();
    const params = this.getHashParams();
    this.getAudioFeatures = this.getAudioFeatures.bind(this);
    this.getMyTopArtists = this.getMyTopArtists.bind(this);
    this.getMyTopTracks = this.getMyTopTracks.bind(this);
    this.deleteCookies = this.deleteCookies.bind(this);
    const token = params.access_token;
    // if (token) {
      spotifyApi.setAccessToken(token);
    // }
    this.state = {
      loggedIn: token
        ? true
        : false,
        term:'medium_term',

    }
  }
  componentDidMount(){
  }

  deleteCookies(e){
    document.cookie = e+'=; Max-Age=-99999999;';
  window.location.href = "index.html";

  }

  getAudioFeatures(){
    this.setState({audioFeatures:true})
    spotifyApi.getMyTopTracks({limit: 10, time_range: 'medium_term'}).then((response) => {
      this.setState({
        topTracksForFeatures: response.items,
        myTopArtists: false,
        myTopTracks:false
      }, console.log('this is top tracks data', response.items))
    })
  .then(()=> scrollIntoView(document.getElementById("audioFeaturesContainer")))
  .catch(err => console.log(err))
  }

  getMyTopTracks(term, callback) {
    spotifyApi.getMyTopTracks({limit: 10, time_range: term}).then((response) => {

      this.setState({myTopTracks: response.items,
        myTopArtists:false,
        topTracksForFeatures:false,
      }, callback)
    })
    .then(()=> scrollIntoView(document.getElementById("topTracksContainer")))
    .catch(err => console.log(err))
  }

getMyTopArtists(term, callback) {
    spotifyApi.getMyTopArtists({limit: 10, time_range: term}).then((response) => {
        this.setState({
    myTopArtists: response.items,
    myTopTracks:false,
    topTracksForFeatures:false,
    term: term,
}, callback);
}).then(()=> scrollIntoView(document.getElementById("topArtistsContainer")))
    .catch(err => console.log(err))
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
     if (process.env.NODE_ENV !== 'production') {
       anchor = 'http://www.localhost:5000/login'
     }
     else{
       anchor = 'https://spot-stats.herokuapp.com/login';
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
      { this.state.loggedIn === false  &&
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark fixed-top" id="nav-transparent">
        <div className="container">
          <a className="navbar-brand" href="index.html">Spot.Stats</a>
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href={anchor}>Sign In</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    }
    { this.state.loggedIn !== false  &&


    <nav className="navbar fixed-top navbar-expand-lg navbar-dark fixed-top" id="nav-transparent">
      <div className="container">
        <a className="navbar-brand" href="index.html">Spot.Stats</a>
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="about.html">About</a>
            </li>
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdownPortfolio" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Features
            </a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownPortfolio">
            <a className="dropdown-item" onClick ={() => this.getMyTopTracks(this.state.term)}>Top Tracks</a>
            <a className="dropdown-item" onClick ={() => this.getMyTopArtists(this.state.term)}>Top Artists</a>
            <a className="dropdown-item" onClick ={() => this.getAudioFeatures()}>Audio Features</a>
            </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick ={() => this.deleteCookies()}>Log Out</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  }

      <header>

        <div id="carousel" className="carousel slide carousel-fade" data-ride="carousel"  data-interval="3000">

          <ol className="carousel-indicators">
            <li data-target="#carousel" data-slide-to="0" className="active"></li>
            <li data-target="#carousel" data-slide-to="1"></li>
            <li data-target="#carousel" data-slide-to="2"></li>
          </ol>
          <div className="carousel-inner" role="listbox">
            {/* Slide One - Set the background image for this slide in the line below */}
            <div className="carousel-item active" style={{backgroundImage: `url(smoke3.jpg)`}}>
              <div className="carousel-caption d-none d-md-block" style={{backgroundColor:'transparent'}}>
                <h3>First Slide</h3>
                <p>This is a description for the first slide.</p>
              </div>
            </div>
          {/*- Slide Two - Set the background image for this slide in the line below*/}
            <div className="carousel-item" style={{backgroundImage: `url(smoke2.jpg)`}}>
              <div className="carousel-caption d-none d-md-block" style={{backgroundColor:'transparent'}}>
                <h3>Second Slide</h3>
                <p>This is a description for the second slide.</p>
              </div>
            </div>
            {/*-- Slide Three - Set the background image for this slide in the line below */}
            <div className="carousel-item" style={{backgroundImage: `url(smoke4.jpg)`}}>
              <div className="carousel-caption d-none d-md-block" style={{backgroundColor:'transparent'}}>
                <h3>Third Slide</h3>
                <p>This is a description for the third slide.</p>
              </div>
            </div>
          </div>
          <a className="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carousel" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </header>

      {/*Page Content */}
      {
        this.state.loggedIn &&
      <div className="container">
          {/*-- Portfolio Section*/}
          <br/>
          <br/>
        <div className="row">

          <div className="col-lg-4 col-sm-6 portfolio-item">
            <div className="card h-100">
              <a href="#"><img className="card-img-top" src="audioFeaturesCard.jpg" alt=""/></a>
              <div className="card-body">
                <h4 className="card-title">
                  <a href="#" onClick ={() => this.getAudioFeatures()}>Get Audio Features of your Favorite Tracks</a>
                </h4>
                <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 portfolio-item">
            <div className="card h-100">
              <a href="#"><img className="card-img-top" src="topArtistsCard.jpg" alt=""/></a>
              <div className="card-body">
                <h4 className="card-title">
                  <a href="#" onClick ={() => this.getMyTopArtists(this.state.term)}>Check Your 10 Top Artists Popularity</a>
                </h4>
                <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 portfolio-item">
            <div className="card h-100">
              <a href="#"><img className="card-img-top" src="topTracksCard.jpg" alt=""/></a>
              <div className="card-body">
                <h4 className="card-title">
                  <a href="#" onClick ={() => this.getMyTopTracks(this.state.term)}>Check Your 10 Top Tracks</a>
                </h4>
                <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos quisquam, error quod sed cumque, odio distinctio velit nostrum temporibus necessitatibus et facere atque iure perspiciatis mollitia recusandae vero vel quam!</p>
              </div>
            </div>
          </div>

        </div>
        {/*.row */}
        {
          this.state.myTopArtists &&
          <React.Fragment>
          <br/>
          <br/>
          <TopArtists artists={artists} getMyTopArtists= {this.getMyTopArtists.bind(this)}/>
          </React.Fragment>
        }
        {
          this.state.myTopTracks &&
          <React.Fragment>
          <br/>
          <br/>
          <TopTracks tracks={tracks} getMyTopTracks= {this.getMyTopTracks.bind(this)}/>
          </React.Fragment>
        }
        {
          this.state.topTracksForFeatures &&
          <React.Fragment>
          <br/>
          <br/>
          <AudioFeatures tracks={this.state.topTracksForFeatures}/>
          </React.Fragment>
        }
        {this.state.noNowPlaying === true && <div id='nowPlayingContainer'>Nothing is playing at the moment</div>}
        {this.state.nowPlaying && this.state.noNowPlaying !== true &&
          <div id='nowPlayingContainer'>
          Now Playing: {this.state.nowPlaying.name}s
          <img alt='album-art' src={this.state.nowPlaying.albumArt} style={{
            height: 100
          }}/>
          </div>}
        {/*-- Features Section */}
        <br/>
        <br/>
        <br/>

        <div className="row">
          <div className="col-lg-6">
            <h2>Modern Business Features</h2>
            <p>The Modern Business template by Start Bootstrap includes:</p>
            <ul>
              <li>
                <strong>Bootstrap v4</strong>
              </li>
              <li>jQuery</li>
              <li>Font Awesome</li>
              <li>Working contact form with validation</li>
              <li>Unstyled page elements for easy customization</li>
            </ul>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, omnis doloremque non cum id reprehenderit, quisquam totam aspernatur tempora minima unde aliquid ea culpa sunt. Reiciendis quia dolorum ducimus unde.</p>
          </div>
          <div className="col-lg-6">
            <img className="img-fluid rounded" src="http://placehold.it/700x450" alt=""/>
          </div>
        </div>
        {/*.row */}

        <hr></hr>

        {/* Call to Action Section */}
        <div className="row mb-4">
          <div className="col-md-8">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, expedita, saepe, vero rerum deleniti beatae veniam harum neque nemo praesentium cum alias asperiores commodi.</p>
          </div>
          <div className="col-md-4">
            <a className="btn btn-lg btn-secondary btn-block" href="#">Call to Action</a>
          </div>
        </div>

      </div>
    }

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-white">Copyright &copy; Jonathan Bareket 2018</p>
        </div>
        {/* /.container */}
      </footer>


      </div>
    );
  }
}

export default App;
