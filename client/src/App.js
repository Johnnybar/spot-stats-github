import React, {Component} from 'react';
import './App.css';
import AudioFeatures from './audio-features';
import TopArtists from './top-artists';
import TopTracks from './top-tracks';
import CustomizedTracks from './customized-tracks';
import SpotifyWebApi from 'spotify-web-api-js';
import scrollIntoView from 'scroll-into-view';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
      valence_status: true

    }
  }
  componentDidMount() {}

  deleteCookies(e) {
    document.cookie = e + '=; Max-Age=-99999999;';
    window.location.href = "index.html";

  }
  getTracksByFeatures(general) {

    let currentState = this.state;
    var propNames = Object.keys(currentState).filter(function (prop) {
      return (~prop.indexOf("max") || ~prop.indexOf("min"))
    })
    let options ={};
    let ids = this.state.topTracksForFeatures.map(track=>  track.id);

    //// line below for a general search://////////
    if(general ==="general"){
      delete options.seed_tracks;
      options["seed_genres"] = [ "electro","rock", "hip_hop", "jazz", "classical"]
    }
    else{
      delete options.seed_genres;

      options["seed_tracks"] = ids.slice(0,4)
    }
    for(var p of propNames){

      options[p]= currentState[p]
    }

    spotifyApi.getRecommendations(options).then((response) => {
      this.setState({
        tracksFromChosenFeatures: response.tracks,
        myTopArtists: false,
        myTopTracks: false
      })
      console.log(options, response, 'This is options and results');
      // customizedTracks = this.state.tracksFromChosenFeatures;
      //   customizedTrackList = customizedTracks.map(track => `${track.artists[0].name} - ${track.name} ` );
      // customizedSample = customizedTracks.map(track => track.preview_url)

    }).catch(err => console.log(err))
  }
  getAudioFeatures() {
    this.setState({audioFeatures: true})
    spotifyApi.getMyTopTracks({limit: 10, time_range: 'medium_term'}).then((response) => {
      this.setState({
        topTracksForFeatures: response.items,
        myTopArtists: false,
        myTopTracks: false,
      })
    }).then(() => scrollIntoView(document.getElementById("audioFeaturesContainer"))).catch(err => console.log(err))
  }

  getMyTopTracks(term, callback) {
    spotifyApi.getMyTopTracks({limit: 10, time_range: term}).then((response) => {

      this.setState({
        myTopTracks: response.items,
        myTopArtists: false,
        topTracksForFeatures: false,
        tracksFromChosenFeatures: false

      }, callback)
    }).then(() => scrollIntoView(document.getElementById("topTracksContainer"))).catch(err => console.log(err))
  }

  getMyTopArtists(term, callback) {
    spotifyApi.getMyTopArtists({limit: 10, time_range: term}).then((response) => {
      this.setState({
        myTopArtists: response.items,
        myTopTracks: false,
        topTracksForFeatures: false,
        tracksFromChosenFeatures: false,
        term: term
      }, callback);
    }).then(() => scrollIntoView(document.getElementById("topArtistsContainer"))).catch(err => console.log(err))
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

    {/*display list of customized tracks*/}
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
            <a className="nav-link" href={anchor}>Sign In</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  {/* <!-- Header --> */}
  <header className="masthead">
    <div className="container d-flex h-100 align-items-center">
      <div className="mx-auto text-center">
<h1 className="mx-auto my-0" style={{fontFamily:'Delicate'}}>Spot.Stats</h1>
        <h2 className="text-white-50 mx-auto mt-2 mb-5">The go-to page for your customized Spotify usage statistics, recommendations and search</h2>
        <a href="#about" className="btn btn-primary js-scroll-trigger">Get Started</a>
      </div>
    </div>
  </header>

  {/* <!-- About Section --> */}
  <section id="about" className="about-section text-center">
    <div className="container">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h2 className="text-white mb-4">Built with Bootstrap 4</h2>
          <p className="text-white-50">Grayscale is a free Bootstrap theme created by Start Bootstrap. It can be yours right now, simply download the template on
            <a href="http://startbootstrap.com/template-overviews/grayscale/">the preview page</a>. The theme is open source, and you can use it for any purpose, personal or commercial.</p>
          </div>
        </div>
        <img src="ipad.png" className="img-fluid" alt=""></img>
      </div>
    </section>

    {/* <!-- Projects Section --> */}
    <section id="projects" className="projects-section bg-light">
      <div className="container">

        {/* <!-- Featured Project Row --> */}
        <div className="row align-items-center no-gutters mb-4 mb-lg-5">
          <div className="col-xl-8 col-lg-7">
            <img className="img-fluid mb-3 mb-lg-0" src="bg-masthead.jpg" alt=""></img>
          </div>
          <div className="col-xl-4 col-lg-5">
            <div className="featured-text text-center text-lg-left">
              <h4>Shoreline</h4>
              <p className="text-black-50 mb-0">Grayscale is open source and MIT licensed. This means you can use it for any project - even commercial projects! Download it, customize it, and publish your website!</p>
            </div>
          </div>
        </div>

        {/* <!-- Project One Row --> */}
        <div className="row justify-content-center no-gutters mb-5 mb-lg-0">
          <div className="col-lg-6">
            <img className="img-fluid" src="demo-image-01.jpg" alt=""></img>
          </div>
          <div className="col-lg-6">
            <div className="bg-black text-center h-100 project">
              <div className="d-flex h-100">
                <div className="project-text w-100 my-auto text-center text-lg-left">
                  <h4 className="text-white">Misty</h4>
                  <p className="mb-0 text-white-50">An example of where you can put an image of a project, or anything else, along with a description.</p>
                  <hr className="d-none d-lg-block mb-0 ml-0"></hr>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Project Two Row --> */}
        <div className="row justify-content-center no-gutters">
          <div className="col-lg-6">
            <img className="img-fluid" src="demo-image-02.jpg" alt=""></img>
          </div>
          <div className="col-lg-6 order-lg-first">
            <div className="bg-black text-center h-100 project">
              <div className="d-flex h-100">
                <div className="project-text w-100 my-auto text-center text-lg-right">
                  <h4 className="text-white">Mountains</h4>
                  <p className="mb-0 text-white-50">Another example of a project with its respective description. These sections work well responsively as well, try this theme on a small screen!</p>
                  <hr className="d-none d-lg-block mb-0 mr-0"></hr>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    {/* <!-- Contact Section --> */}
    <section className="contact-section bg-black">
      <div className="container">

        <div className="row">

          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card py-4 h-100">
              <div className="card-body text-center">
                <i className="fas fa-map-marked-alt text-primary mb-2"></i>
                <h4 className="text-uppercase m-0">Address</h4>
                <hr className="my-4"></hr>
                <div className="small text-black-50">4923 Market Street, Orlando FL</div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card py-4 h-100">
              <div className="card-body text-center">
                <i className="fas fa-envelope text-primary mb-2"></i>
                <h4 className="text-uppercase m-0">Email</h4>
                <hr className="my-4"></hr>
                <div className="small text-black-50">
                  <a href="#smtg">hello@yourdomain.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card py-4 h-100">
              <div className="card-body text-center">
                <i className="fas fa-mobile-alt text-primary mb-2"></i>
                <h4 className="text-uppercase m-0">Phone</h4>
                <hr className="my-4"></hr>
                <div className="small text-black-50">+1 (555) 902-832</div>
              </div>
            </div>
          </div>
        </div>

        <div className="social d-flex justify-content-center">
          <a href="#smtg" className="mx-2">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#smtg" className="mx-2">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#smtg" className="mx-2">
            <i className="fab fa-github"></i>
          </a>
        </div>

      </div>
    </section>

    {/* <!-- Footer --> */}
    <footer className="bg-black small text-center text-white-50">
      <div className="container">
        Copyright &copy; Your Website 2018ss
      </div>
    </footer>


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

    {/* <!-- Header --> */}
    <header className="masthead">
      <div className="container d-flex h-100 align-items-center">
        <div className="mx-auto text-center">
          <h1 className="mx-auto my-0" style={{fontFamily:'Delicate'}}>Spot.Stats</h1>
          <h2 className="text-white-50 mx-auto mt-2 mb-5">The go-to page for your customized Spotify usage statistics, recommendations and search</h2>
          <a href="#features-container" className="btn btn-primary js-scroll-trigger" onClick={()=>scrollIntoView(document.getElementById("features-section"))}>Check It Out</a>
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
                <h4 className="text-uppercase m-0" style={{fontSize: "0.8rem",
                  fontFamily: 'Varela Round',
                  textTransform: "uppercase",
                  letterSpacing: "0.15rem"}}>
                  <a href="#smtg" style={{color:"black"}} onClick ={() => this.getAudioFeatures()}>Audio Features</a>
                </h4>
                <hr className="my-4"></hr>
                {/* <a href="#smtg" onClick ={() => this.getAudioFeatures()}><img className="card-img-top" src="audioFeaturesCard.jpg" alt=""/></a> */}
                <div className="small text-black-50">Get Audio Features of your Favorite Tracks</div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card py-4 h-100">
              <div className="card-body text-center">
                <i className="fas fa-fire text-primary mb-2"></i>
                <h4 className="text-uppercase m-0" style={{fontSize: "0.8rem",
                  fontFamily: 'Varela Round',
                  textTransform: "uppercase",
                  letterSpacing: "0.15rem"}}>
                  <a href="#smtg" style={{color:"black"}} onClick ={() => this.getMyTopArtists(this.state.term)}>Top 10 Artists</a>
                </h4>
                <hr className="my-4"></hr>
                <div className="small text-black-50">Check Your Top 10 Artists and their Popularity</div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card py-4 h-100">
              <div className="card-body text-center">
                <i className="fas fa-headphones-alt text-primary mb-2"></i>
                <h4 className="text-uppercase m-0" style={{fontSize: "0.8rem",
                  fontFamily: 'Varela Round',
                  textTransform: "uppercase",
                  letterSpacing: "0.15rem"}}>
                  <a href="#smtg" style={{color:"black"}} onClick ={() => this.getMyTopTracks(this.state.term)}>Check Your Top 10 Tracks</a>
                </h4>
                <hr className="my-4"></hr>
                <div className="small text-black-50">Check Your Top 10 Tracks</div>
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
    <br/>
    <br/>
    <TopArtists artists={artists} getMyTopArtists={this.getMyTopArtists.bind(this)}/>
  </React.Fragment>
}
{
  this.state.myTopTracks && <React.Fragment>
    <br/>
    <br/>
    <TopTracks tracks={tracks} getMyTopTracks={this.getMyTopTracks.bind(this)}/>
  </React.Fragment>
}
{
  this.state.topTracksForFeatures && <React.Fragment>
    <br/>
    <br/>
    <AudioFeatures tracks={this.state.topTracksForFeatures}/>
    {/* Buttons for activating slider and slider with values */}
    {/* Buttons for customizing tracks */}
    <div id="customizedButtonsContainer container">
      <div className='container title-plus-slider'>
        <button className="btn" disabled={this.state.energy_status}>
          <p onClick={() => {
            this.setState(prevState => ({
              energy_status: !prevState.energy_status
            }));
          }}>Energy</p>
        </button>
        {
          this.state.energy_status == false && <React.Fragment>
            <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
              let valueArr = e;
              this.setState({min_energy: valueArr[0], max_energy: valueArr[1]})
            }
          }/>
          <br/>
        </React.Fragment>
      }
    </div>
    <div className='container title-plus-slider'>
      <button className="btn" disabled={this.state.acousticness_status}>
        <p onClick={() => {
          this.setState(prevState => ({
            acousticness_status: !prevState.acousticness_status
          }))
        }}>Acousticness</p>
      </button>
      {
        this.state.acousticness_status == false && <React.Fragment>
          <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
            let valueArr = e;
            this.setState({min_acousticness: valueArr[0], max_acousticness: valueArr[1]})
          }
        }/>
        <br/>
      </React.Fragment>
    }
  </div>
  <div className='container title-plus-slider'>
    <button className="btn" disabled={this.state.danceability_status}>
      <p onClick={() => {
        this.setState(prevState => ({
          danceability_status: !prevState.danceability_status
        }));
      }}>Danceability</p>
    </button>
    {
      this.state.danceability_status == false && <React.Fragment>
        <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
          let valueArr = e;
          this.setState({min_danceability: valueArr[0], max_danceability: valueArr[1]})
        }
      }/>
      <br/>
    </React.Fragment>
  }
</div>
<div className='container title-plus-slider'>
  <button className="btn" disabled={this.state.instrumentalness_status}>
    <p onClick={() => {
      this.setState(prevState => ({
        instrumentalness_status: !prevState.instrumentalness_status
      }));
    }}>Instrumentalness</p>
  </button>
  {
    this.state.instrumentalness_status == false && <React.Fragment>
      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
        let valueArr = e;
        this.setState({min_instrumentalness: valueArr[0], max_instrumentalness: valueArr[1]})
      }
    }/>
    <br/>
  </React.Fragment>
}
</div>
<div className='container title-plus-slider'>
  <button className="btn" disabled={this.state.liveness_status}>
    <p onClick={() => {
      this.setState(prevState => ({
        liveness_status: !prevState.liveness_status
      }));
    }}>Liveness</p>
  </button>
  {
    this.state.liveness_status == false && <React.Fragment>
      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
        let valueArr = e;
        this.setState({min_liveness: valueArr[0], max_liveness: valueArr[1]})
      }
    }/>
    <br/>
  </React.Fragment>
}
</div>
<div className='container title-plus-slider'>
  <button className="btn" disabled={this.state.valence_status}>
    <p onClick={() => {
      this.setState(prevState => ({
        valence_status: !prevState.valence_status
      }));
    }}>Positivity</p>
  </button>
  {
    this.state.valence_status == false && <React.Fragment>
      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
        let valueArr = e;
        this.setState({min_valence: valueArr[0], max_valence: valueArr[1]})
      }
    }/>
    <br/>
  </React.Fragment>
}
</div>
<div className='container title-plus-slider'>
  <button className="btn" disabled={this.state.speechiness_status}>
    <p onClick={() => {
      this.setState(prevState => ({
        speechiness_status: !prevState.speechiness_status
      }));
    }}>Speechiness</p>
  </button>
  {
    this.state.speechiness_status == false && <React.Fragment>
      <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
        let valueArr = e;
        this.setState({min_speechiness: valueArr[0], max_speechiness: valueArr[1]})
      }
    }/>
    <br/>
  </React.Fragment>
}
</div>


</div>

{/* Slider and slider values */}
<div className="text-center">
  <button className = "btn btn-primary center-block"
    onClick={this.getTracksByFeatures.bind(this)}>Use the sliders to search for similar tracks <br/>
    with your own customized features and click here</button>
    <button className = "btn btn-primary center-block"
      onClick={this.getTracksByFeatures.bind(this, "general")}>
      or click here for general results to your <br/>
      customized music search</button>
      {/* <button className = "btn btn-primary center-block" onClick={this.getTracksByFeaturesExpanded.bind(this)}>Or here to search general tracks unrelated to your taste</button> */}
    </div>
    <br/>
  </React.Fragment>

}
{
  this.state.tracksFromChosenFeatures && <div className = 'customized-tracks-container container'>

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
        <h2 className="text-white mb-5">Subscribe to receive updates!</h2>

        <form className="form-inline d-flex">
          <input type="email" className="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" id="inputEmail" placeholder="Enter email address..."></input>
          <button type="submit" className="btn btn-primary mx-auto">Subscribe</button>
        </form>

      </div>
    </div>

    <div className="social d-flex justify-content-center">
      <a href="#smtg" className="mx-2">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="#smtg" className="mx-2">
        <i className="fab fa-facebook-f"></i>
      </a>
      <a href="#smtg" className="mx-2">
        <i className="fab fa-github"></i>
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
