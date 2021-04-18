import React, { Component } from 'react';
import './App.css';
import AudioFeatures from './audio-features';
import TopArtists from './top-artists';
import TopTracks from './top-tracks';
import CustomizedTracks from './customized-tracks';
import SpotifyWebApi from 'spotify-web-api-js';
import scrollIntoView from 'scroll-into-view';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { createPlaylist } from './spotify_modules';


const spotifyApi = new SpotifyWebApi();

const marks = {
  0: '0',
  0.25: '0.25',
  0.50: '0.5',
  0.75: '0.75',
  1: {
    style: {
      color: 'red'
    },
    label: <strong>1</strong>
  }
};


class App extends Component {
  constructor() {
    super();
    this.textInput = React.createRef();
    const params = this.getHashParams();
    this.getAudioFeatures = this.getAudioFeatures.bind(this);
    this.getMyTopArtists = this.getMyTopArtists.bind(this);
    this.getMyTopTracks = this.getMyTopTracks.bind(this);
    this.deleteCookies = this.deleteCookies.bind(this);
    this.createPlaylist = createPlaylist.bind(this);

    const token = params.access_token;
    // if (token) {
    spotifyApi.setAccessToken(token);
    // }
    this.state = {
      loggedIn: token
        ? true
        : false,
      term: 'medium_term',
      danceability_status: true,
      energy_status: true,
      speechiness_status: true,
      acousticness_status: true,
      instrumentalness_status: true,
      liveness_status: true,
      valence_status: true,
      featuresHidden: false

    }
  }

  componentDidMount() { }


  deleteCookies(e) {
    document.cookie = e + '=; Max-Age=-99999999;';
    window.location.href = "index.html";

  }

  getTracksByFeatures(general) {

    let currentState = this.state;
    var propNames = Object.keys(currentState).filter(function (prop) {
      return (~prop.indexOf("max") || ~prop.indexOf("min"))
    })
    let options = {};
    let ids = this.state.topTracksForFeatures.map(track => track.id);

    //// line below for a general search://////////
    if (general === "general") {
      delete options.seed_tracks;
      options["seed_genres"] = ["electro", "rock", "hip_hop", "jazz", "classical"]
    }
    else {
      delete options.seed_genres;

      options["seed_tracks"] = ids.slice(0, 4)
    }
    for (var p of propNames) {

      options[p] = currentState[p]
    }

    spotifyApi.getRecommendations(options).then((response) => {
 
      this.setState({
        tracksFromChosenFeatures: response.tracks.slice(0, 8),
        myTopArtists: false,
        myTopTracks: false,
        customizedTracksUriList: response.tracks.slice(0, 8).map((track) => track.uri)

      }
      )

      // let customizedTracksUriList;;
      // if (this.state.tracksFromChosenFeatures){
      //   console.log("this.state.tracksFromChosenFeatures ", this.state.tracksFromChosenFeatures);
      //   customizedTracksUriList = this.state.tracksFromChosenFeatures.map((track)=> track.uri)
      //   this.setState()
      // }

      // customizedTracks = this.state.tracksFromChosenFeatures;
      //   customizedTrackList = customizedTracks.map(track => `${track.artists[0].name} - ${track.name} ` );
      // customizedSample = customizedTracks.map(track => track.preview_url)

    })
      .then(() => scrollIntoView(document.getElementById("customized-tracks-container")))
      .catch(err => console.log(err))
  }
  getAudioFeatures() {
    this.setState({ audioFeatures: true, featuresHidden: false })
    spotifyApi.getMyTopTracks({ limit: 9, time_range: 'medium_term' }).then((response) => {
      this.setState({
        topTracksForFeatures: response.items,
        myTopArtists: false,
        myTopTracks: false
      })
    }).then(() => scrollIntoView(document.getElementById("audioFeaturesContainer"))).catch(err => console.log(err))
  }

  getMyTopTracks(term, callback) {
    spotifyApi.getMyTopTracks({ limit: 10, time_range: term }).then((response) => {

      this.setState({
        myTopTracks: response.items,
        myTopArtists: false,
        topTracksForFeatures: false,
        tracksFromChosenFeatures: false

      }, callback)
    }).then(() => scrollIntoView(document.getElementById("topTracksContainer"))).catch(err => console.log(err))
  }

  getMyTopArtists(term, callback) {
    spotifyApi.getMyTopArtists({ limit: 10, time_range: term }).then((response) => {
      this.setState({
        myTopArtists: response.items,
        myTopTracks: false,
        topTracksForFeatures: false,
        tracksFromChosenFeatures: false,
        term: term
      }, callback);
    }).then(() => scrollIntoView(document.getElementById("topArtists"))).catch(err => console.log(err))
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
    } else {
      anchor = 'https://spot-stats.herokuapp.com/login';
    }
    let artists;
    let tracks;
    if (this.state.myTopArtists) {
      artists = this.state.myTopArtists;
    } else if (this.state.myTopTracks) {
      tracks = this.state.myTopTracks;
    }

    // if(this.state.tracksFromChosenFeatures){
    //    customizedTrackList = this.state.tracksFromChosenFeatures.map(track => track.artists[0].name + ' - ' + track.name)
    // }

    return (<div className="app">

      {
        this.state.loggedIn === false &&
        <div>
          {/* <nav className="navbar fixed-top navbar-expand-lg navbar-dark fixed-top" id="nav-transparent">
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
</nav> */}
          <div id="page-top">

            {/* <!-- Navigation --> */}
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
              <div className="container">
                <a className="navbar-brand js-scroll-trigger" href="index.html">Spot.Stats</a>
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                  {/* <span className="navbar-toggler-icon"></span> */}

                  <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <a className="nav-link" href={anchor}>Log in to Spotify to start</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            {/* <!-- Header --> */}
            <header className="masthead">
              <div className="container d-flex h-100 align-items-center">
                <div className="mx-auto text-center">
                  <h1 className="mx-auto my-0" style={{ fontFamily: 'Delicate' }}>Spot.Stats</h1>
                  <a href="#about" className="btn btn-primary js-scroll-trigger btn-transparent">Get Started</a>
                </div>
              </div>
            </header>

            {/* <!-- About Section --> */}
            <section id="about" className="about-section text-center">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 mx-auto">
                    <h2 className="text-white mb-4">Your Spotify go-to page</h2>
                    <p className="text-white-50">Use Spotify's algorithm to generate interactive charts based on your music, get custom-made recommendations or customize your own algorithm, and get an insight into your own taste</p>
                  </div>
                </div>
                <img src="ipad3.png" className="img-fluid" alt=""></img>
              </div>
            </section>

            {/* <!-- Projects Section --> */}
            <section id="projects" className="projects-section bg-light">
              <div className="container">

                {/* <!-- Featured Project Row --> */}
                <div className="row align-items-center no-gutters mb-4 mb-lg-5">
                  <div className="col-xl-8 col-lg-7">
                    <img className="img-fluid mb-3 mb-lg-0" src="dist/images/chris-liverani-552652-unsplash.jpg" alt=""></img>
                  </div>
                  <div className="col-xl-4 col-lg-5">
                    <div className="featured-text text-center text-lg-left">
                      <h4>Get an insight into your music</h4>
                      <p className="text-black-50 mb-0">Using Spotify's algorithm, find out about your listening habits using attractive, interactive charts. Toggle between your favorite artists and tracks these days and your all-time favorites. Easily get recommendations based on your taste and listen to samples.</p>
                    </div>
                  </div>
                </div>

                {/* <!-- Project One Row --> */}
                <div className="row justify-content-center no-gutters mb-5 mb-lg-0">
                  <div className="col-lg-6">
                    <img className="img-fluid" src="dist/images/dayne-topkin-60559-unsplash.jpg" alt=""></img>
                  </div>
                  <div className="col-lg-6">
                    <div className="bg-black text-center h-100 project">
                      <div className="d-flex h-100">
                        <div className="project-text w-100 my-auto text-center text-lg-left">
                          <h4 className="text-white">Break down your tracks and see what they're made of</h4>
                          <p className="mb-0 text-white-50">Get an analysis of your favorite tracks, based on features such as danceability and positivity,  and let the clever pie chart sort your tracks out for you.</p>
                          <hr className="d-none d-lg-block mb-0 ml-0"></hr>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Project Two Row --> */}
                <div className="row justify-content-center no-gutters">
                  <div className="col-lg-6">
                    <img className="img-fluid" src="dist/images/adi-goldstein-796588-unsplash.jpg" alt=""></img>
                  </div>
                  <div className="col-lg-6 order-lg-first">
                    <div className="bg-black text-center h-100 project">
                      <div className="d-flex h-100">
                        <div className="project-text w-100 my-auto text-center text-lg-right">
                          <h4 className="text-white">Customize your own recommendations</h4>
                          <p className="mb-0 text-white-50">Using interactive sliders, choose which kind of tracks you'd like to search for, based on multiple categories and tastes. Choose to search using your favorite tracks as a reference or search spotify without limitations.</p>
                          <hr className="d-none d-lg-block mb-0 mr-0"></hr>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>


            {/* <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script> */}


          </div>

        </div>
      }
      {
        this.state.loggedIn !== false &&

        <div id="page-top">

          {/* <!-- Navigation --> */}
          <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
            <div className="container">
              <a className="navbar-brand js-scroll-trigger" href="index.html">Spot.Stats</a>
              <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                {/* <span className="navbar-toggler-icon"></span> */}

                <i className="fas fa-bars"></i>
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
                      <a className="dropdown-item" onClick={() => this.getMyTopTracks(this.state.term)}>Top Tracks</a>
                      <a className="dropdown-item" onClick={() => this.getMyTopArtists(this.state.term)}>Top Artists</a>
                      <a className="dropdown-item" onClick={() => this.getAudioFeatures()}>Audio Features</a>
                    </div>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => this.deleteCookies()}>Log Out</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* <!-- Header --> */}
          <header className="masthead">
            <div className="container d-flex h-100 align-items-center">
              <div className="mx-auto text-center">
                <h1 className="mx-auto my-0" style={{ fontFamily: 'Delicate' }}>Spot.Stats</h1>
                <h2 className="text-white-50 mx-auto mt-2 mb-5">The go-to page for your customized Spotify usage statistics, recommendations and search</h2>
                <a href="#features-container" className="btn btn-primary js-scroll-trigger btn-white" onClick={() => scrollIntoView(document.getElementById("features-section"))}>Check It Out</a>
              </div>
            </div>
          </header>

          {/* <!-- Features Section --> */}
          <section className="contact-section bg-black" id="features-section">
            <div className="container">

              <div className="row">

                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="card py-4 h-100">
                    <div className="card-body text-center">
                      <i className="fas fa-chart-pie text-primary mb-2"></i>
                      <h4 className="text-uppercase m-0" style={{
                        fontSize: "0.8rem",
                        fontFamily: 'Varela Round',
                        textTransform: "uppercase",
                        letterSpacing: "0.15rem"
                      }}>
                        <a href="#" style={{ color: "black" }} onClick={() => this.getAudioFeatures()}>Audio Features & Feature Search</a>
                      </h4>
                      <hr className="my-4"></hr>
                      {/* <a href="#smtg" onClick ={() => this.getAudioFeatures()}><img className="card-img-top" src="audioFeaturesCard.jpg" alt=""/></a> */}
                      <div className="small text-black-50">Get Audio Features of your Favorite Tracks, Search for Tracks Based on Features</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="card py-4 h-100">
                    <div className="card-body text-center">
                      <i className="fas fa-fire text-primary mb-2"></i>
                      <h4 className="text-uppercase m-0" style={{
                        fontSize: "0.8rem",
                        fontFamily: 'Varela Round',
                        textTransform: "uppercase",
                        letterSpacing: "0.15rem"
                      }}>
                        <a href="#smtg" style={{ color: "black" }} onClick={() => this.getMyTopArtists(this.state.term)}>Top 10 Artists</a>
                      </h4>
                      <hr className="my-4"></hr>
                      <div className="small text-black-50">Check Your Top 10 Artists, Get Recommendations for each Artist</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="card py-4 h-100">
                    <div className="card-body text-center">
                      <i className="fas fa-headphones-alt text-primary mb-2"></i>
                      <h4 className="text-uppercase m-0" style={{
                        fontSize: "0.8rem",
                        fontFamily: 'Varela Round',
                        textTransform: "uppercase",
                        letterSpacing: "0.15rem"
                      }}>
                        <a href="#smtg" style={{ color: "black" }} onClick={() => this.getMyTopTracks(this.state.term)}>Top 10 Tracks</a>
                      </h4>
                      <hr className="my-4"></hr>
                      <div className="small text-black-50">Check Your Top 10 Tracks and Generate Track Playlists based on them</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      }
      <header>
      </header>

      {/* Page Content */}
      {
        this.state.loggedIn && <div className="container" id="fade-bg">


          {
            this.state.myTopArtists && <React.Fragment>
              <br />
              <br />
              <TopArtists artists={artists} getMyTopArtists={this.getMyTopArtists.bind(this)} />
            </React.Fragment>
          }
          {
            this.state.myTopTracks && <React.Fragment>
              <br />
              <br />
              <TopTracks tracks={tracks} getMyTopTracks={this.getMyTopTracks.bind(this)} />
            </React.Fragment>
          }
          {
            this.state.topTracksForFeatures && <React.Fragment>
              <br />
              <br />
              {this.state.topTracksForFeatures && this.state.featuresHidden !== true &&
                <AudioFeatures tracks={this.state.topTracksForFeatures} />
              }
              {/* Buttons for activating slider and slider with values */}
              {/* Buttons for customizing tracks */}
              <div className="customizedButtonsContainer container" id="customizedButtonsContainer">
                <div className="empty-space"></div>
                <h3 className="grey-text">Customize your search based on features</h3>

                <div className='container title-plus-slider'>

                  <button className="btn btn-slider btn-transparent" disabled={this.state.energy_status}>
                    <p onClick={() => {
                      this.setState(prevState => ({
                        energy_status: !prevState.energy_status,
                        featuresHidden: true
                      }));
                    }}>Energy</p>
                  </button>
                  {
                    this.state.energy_status === false && <React.Fragment>
                      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                        let valueArr = e;
                        this.setState({ min_energy: valueArr[0], max_energy: valueArr[1] })
                      }
                      } />
                      <br />
                    </React.Fragment>
                  }
                </div>
                <div className='container title-plus-slider'>
                  <button className="btn btn-slider btn-transparent" disabled={this.state.acousticness_status}>
                    <p onClick={() => {
                      this.setState(prevState => ({
                        acousticness_status: !prevState.acousticness_status,
                        featuresHidden: true
                      }))
                    }}>Acousticness</p>
                  </button>
                  {
                    this.state.acousticness_status === false && <React.Fragment>
                      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                        let valueArr = e;
                        this.setState({ min_acousticness: valueArr[0], max_acousticness: valueArr[1] })
                      }
                      } />
                      <br />
                    </React.Fragment>
                  }
                </div>
                <div className='container title-plus-slider'>
                  <button className="btn btn-slider btn-transparent" disabled={this.state.danceability_status}>
                    <p onClick={() => {
                      this.setState(prevState => ({
                        danceability_status: !prevState.danceability_status,
                        featuresHidden: true
                      }));
                    }}>Danceability</p>
                  </button>
                  {
                    this.state.danceability_status === false && <React.Fragment>
                      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                        let valueArr = e;
                        this.setState({ min_danceability: valueArr[0], max_danceability: valueArr[1] })
                      }
                      } />
                      <br />
                    </React.Fragment>
                  }
                </div>
                <div className='container title-plus-slider'>
                  <button className="btn btn-slider btn-transparent" disabled={this.state.instrumentalness_status}>
                    <p onClick={() => {
                      this.setState(prevState => ({
                        instrumentalness_status: !prevState.instrumentalness_status,
                        featuresHidden: true
                      }));
                    }}>Instrumentalness</p>
                  </button>
                  {
                    this.state.instrumentalness_status === false && <React.Fragment>
                      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                        let valueArr = e;
                        this.setState({ min_instrumentalness: valueArr[0], max_instrumentalness: valueArr[1] })
                      }
                      } />
                      <br />
                    </React.Fragment>
                  }
                </div>
                <div className='container title-plus-slider'>
                  <button className="btn btn-slider btn-transparent" disabled={this.state.liveness_status}>
                    <p onClick={() => {
                      this.setState(prevState => ({
                        liveness_status: !prevState.liveness_status,
                        featuresHidden: true
                      }));
                    }}>Liveness</p>
                  </button>
                  {
                    this.state.liveness_status === false && <React.Fragment>
                      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                        let valueArr = e;
                        this.setState({ min_liveness: valueArr[0], max_liveness: valueArr[1] })
                      }
                      } />
                      <br />
                    </React.Fragment>
                  }
                </div>
                <div className='container title-plus-slider'>
                  <button className="btn btn-slider btn-transparent" disabled={this.state.valence_status}>
                    <p onClick={() => {
                      this.setState(prevState => ({
                        valence_status: !prevState.valence_status,
                        featuresHidden: true
                      }));
                    }}>Positivity</p>
                  </button>
                  {
                    this.state.valence_status === false && <React.Fragment>
                      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                        let valueArr = e;
                        this.setState({ min_valence: valueArr[0], max_valence: valueArr[1] })
                      }
                      } />
                      <br />
                    </React.Fragment>
                  }
                </div>
                <div className='container title-plus-slider'>
                  <button className="btn btn-slider btn-transparent" disabled={this.state.speechiness_status}>
                    <p onClick={() => {
                      this.setState(prevState => ({
                        speechiness_status: !prevState.speechiness_status,
                        featuresHidden: true
                      }));
                    }}>Speechiness</p>
                  </button>
                  {
                    this.state.speechiness_status === false && <React.Fragment>
                      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                        let valueArr = e;
                        this.setState({ min_speechiness: valueArr[0], max_speechiness: valueArr[1] })
                      }
                      } />
                      <br />
                    </React.Fragment>
                  }
                </div>


              </div>


              {/* Slider and slider values */}
              <div className="text-center" style={{ paddingTop: 30 }}>
                <button className="btn btn-primary center-block btn-white"
                  onClick={this.getTracksByFeatures.bind(this)}>Search based on your taste</button>
                <button className="btn btn-primary center-block btn-white"
                  onClick={this.getTracksByFeatures.bind(this, "general")}>
                  Search based only on features</button>
                {/* <button className = "btn btn-primary center-block" onClick={this.getTracksByFeaturesExpanded.bind(this)}>Or here to search general tracks unrelated to your taste</button> */}
              </div>
              <br />
            </React.Fragment>

          }
          {
            this.state.tracksFromChosenFeatures && <div id="customized-tracks-container" className='customized-tracks-container container'>
              {this.state.customizedTracksUriList && <button className="btn btn-primary center-block" onClick={(e) => {
                //create a playlist with recommended tracks, take the first artist name to create playlist name
                this.createPlaylist(this.state.customizedTracksUriList, this.state.tracksFromChosenFeatures[0].artists[0].name, "features")
              }}>Save these tracks to a Spotify playlist</button>}

              <CustomizedTracks tracks={this.state.tracksFromChosenFeatures} />

            </div>
          }


        </div>
      }

      {/* Footer */}
      <hr></hr>
      <section id="signup" className="signup-section">
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-lg-8 mx-auto text-center">

              <i className="far fa-paper-plane fa-2x mb-2 text-white"></i>
              <h2 className="text-white mb-5 btn-transparent">Contact Me!</h2>
              <form action="https://formspree.io/johnnybareket@gmail.com" id="contactForm" className='form-inline d-flex form-column' method="POST">
                <br />
                <input type='text' name='FullName' placeholder='Full Name'></input>
                <input type='email' name='Email' placeholder='Email Address'></input>
                <input type='text' name='Subject' placeholder='Subject'></input>
                <textarea name="Message" maxLength="6000" id="form-submit" className="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" placeholder="Enter Message..."></textarea>
                <button type="submit" className="btn btn-primary mx-auto btn-white" value="Send">Submit</button>

              </form>

            </div>
          </div>

          <div className="social d-flex justify-content-center">
            <a rel="noopener noreferrer" href="https://github.com/Johnnybar" className="mx-2" target="_blank">
              <i className="fab fa-github"></i>
            </a>
            <a rel="noopener noreferrer" href="https://www.linkedin.com/in/jonathan-bareket/" className="mx-2" target="_blank">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a rel="noopener noreferrer" href="http://www.jonathanbareket.com" className="mx-2" target="_blank">
              <i className="fas fa-home"></i>
            </a>

          </div>

        </div>
      </section>
      {/* <!-- Footer --> */}
      <footer className="bg-black small text-center text-white-50">
        <div className="container">
          Copyright &copy; Jonathan Bareket 2018
  </div>
      </footer>

    </div>);
  }
}

export default App;
