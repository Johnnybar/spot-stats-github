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
    this.getNowPlaying = this.getNowPlaying.bind(this);
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
      // nowPlaying: {
      //   name: 'Not Checked',
      //   albumArt: ''
      // }
    }
  }
  componentDidMount(){
    // console.log(this.state);
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
    })
    .then(()=> scrollIntoView(document.getElementById("nowPlayingContainer")))
    .catch(this.setState({noNowPlaying:true}, scrollIntoView(document.getElementById("nowPlayingContainer"))) )
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
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark fixed-top">
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


    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark fixed-top">
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
            <li className="nav-item">
              <a className="nav-link" href="services.html">Services</a>
            </li>
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownPortfolio" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Portfolio
            </a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownPortfolio">
            <a className="dropdown-item" href="portfolio-1-col.html">1 Column Portfolio</a>
            <a className="dropdown-item" href="portfolio-2-col.html">2 Column Portfolio</a>
            <a className="dropdown-item" href="portfolio-3-col.html">3 Column Portfolio</a>
            <a className="dropdown-item" href="portfolio-4-col.html">4 Column Portfolio</a>
            <a className="dropdown-item" href="portfolio-item.html">Single Portfolio Item</a>
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
      <br></br>
      <br></br>
      <br></br>


        {/*  {this.state.noNowPlaying === true && <div>Nothing is playing at the moment</div>}
          {this.state.nowPlaying && this.state.noNowPlaying !== true && <div>
            Now Playing: {this.state.nowPlaying.name}s
            <img alt='album-art' src={this.state.nowPlaying.albumArt} style={{
                height: 100
              }}/>
          </div>
        }*/}
        {/*END OF CONTAINER*/}

          {/*  {
            this.state.loggedIn &&
              <div className='search-btns'>
                <button className='btn btn-primary' onClick ={() => this.getNowPlaying()}>
                  Check Now Playing</button>
                <button className='btn btn-primary' onClick ={() => this.getMyTopArtists(this.state.term)}>
                  Check Your 10 Top Artists Popularity</button>
                  <button  className='btn btn-primary' onClick ={() => this.getMyTopTracks(this.state.term)}>
                    Check Your 10 Top Tracks</button>
              </div>
          }*/}

        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">

          <ol className="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
          <div className="carousel-inner" role="listbox">
            {/* Slide One - Set the background image for this slide in the line below */}
            <div className="carousel-item active" style={{backgroundImage: `url(image1.jpg)`}}>
              <div className="carousel-caption d-none d-md-block" style={{backgroundColor:'#424242'}}>
                <h3>First Slide</h3>
                <p>This is a description for the first slide.</p>
              </div>
            </div>
          {/*- Slide Two - Set the background image for this slide in the line below*/}
            <div className="carousel-item" style={{backgroundImage: `url(image3.jpg)`}}>
              <div className="carousel-caption d-none d-md-block" style={{backgroundColor:'#424242'}}>
                <h3>Second Slide</h3>
                <p>This is a description for the second slide.</p>
              </div>
            </div>
            {/*-- Slide Three - Set the background image for this slide in the line below */}
            <div className="carousel-item" style={{backgroundImage: `url(image2.jpg)`}}>
              <div className="carousel-caption d-none d-md-block" style={{backgroundColor:'#424242'}}>
                <h3>Third Slide</h3>
                <p>This is a description for the third slide.</p>
              </div>
            </div>
          </div>
          <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
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
        <h2>Portfolio Heading</h2>

        <div className="row">
          {/*<div className="col-lg-4 col-sm-6 portfolio-item">
            <div className="card h-100">
              <a href="#"><img className="card-img-top" src="http://placehold.it/700x400" alt="" /></a>
              <div className="card-body">
                <h4 className="card-title">
                  <a href="#" onClick ={() => this.getNowPlaying()}>Get Now Playing</a>
                </h4>
                <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur eum quasi sapiente nesciunt? Voluptatibus sit, repellat sequi itaque deserunt, dolores in, nesciunt, illum tempora ex quae? Nihil, dolorem!</p>
              </div>
            </div>
          </div>*/}
          <div className="col-lg-4 col-sm-6 portfolio-item">
            <div className="card h-100">
              <a href="#"><img className="card-img-top" src="http://placehold.it/700x400" alt=""/></a>
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
              <a href="#"><img className="card-img-top" src="http://placehold.it/700x400" alt=""/></a>
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
              <a href="#"><img className="card-img-top" src="http://placehold.it/700x400" alt=""/></a>
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
          <TopArtists artists={artists} getMyTopArtists= {this.getMyTopArtists.bind(this)}/>
          </React.Fragment>
        }
        {
          this.state.myTopTracks &&
          <TopTracks tracks={tracks} getMyTopTracks= {this.getMyTopTracks.bind(this)}/>
        }
        {
          this.state.topTracksForFeatures &&
          <AudioFeatures tracks={this.state.topTracksForFeatures}/>
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
          <p className="m-0 text-center text-white">Copyright &copy; Your Website 2018</p>
        </div>
        {/* /.container */}
      </footer>


      </div>
    );
  }
}

export default App;
