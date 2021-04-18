
import Chart from 'chart.js';
import {getRecommondationGenres} from'./spotify_modules';
import {getTrackInfoAndRecommendation} from'./spotify_modules';
import {getRecommendationsBasedOnTopTracks} from'./spotify_modules';
import { createPlaylist } from './spotify_modules';

// import getMyTopTracks from'./App';
import React from 'react';
// import SpotifyWebApi from'spotify-web-api-js';
// const spotifyApi = new SpotifyWebApi();

let chosenId,
  trackName, topTracks;

export default class TopTracks extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.uponClick = this.uponClick.bind(this);
    this.uponClickOnRecommendButton = this.uponClickOnRecommendButton.bind(this);
    this.uponClickOnTrackRecommendation = this.uponClickOnTrackRecommendation.bind(this);
    this.getRecommendationsBasedOnTopTracks = getRecommendationsBasedOnTopTracks.bind(this)
    this.getTrackInfoAndRecommendation = getTrackInfoAndRecommendation.bind(this);
    this.getRecommondationGenres = getRecommondationGenres.bind(this);
    this.updateConfigByMutating = this.updateConfigByMutating.bind(this);
    this.createPlaylist = createPlaylist.bind(this);
  }

  componentDidMount() {
    let {tracks} = this.props;
    let trackPopularity = tracks.map(track => track.popularity)
    let trackList = tracks.map(track => track.artists[0].name + ' - ' + track.name);
    let trackIds = tracks.map(track => track.id);
    let artistsIds = tracks.map(track => track.artists[0].id)

    //get all genres to be able to generate a random list of recommendations based on toptracks
    this.getRecommondationGenres(artistsIds);

    let ctx = document.getElementById("topTracks").getContext('2d');
     topTracks = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: trackList,
        datasets: [
          {
            label: 'Popularity',
            data: trackPopularity,
            backgroundColor: [
              'rgba(80,81,79, 0.9)',
              'rgba(242,95,92, 0.9)',
              'rgba(255,224,102, 0.9)',
              'rgba(36,123,160, 0.9)',
              'rgba(172,127,141, 0.9)',
              'rgba(0, 0,0,0.8)',
              'rgba(214,40,40, 0.9)',
              'rgba(244,162,97, 0.9)',
              'rgba(0,168,232, 0.9)',
              'rgba(81,59,86, 0.9)'
            ],
            borderColor: [
              'rgba(80,81,79, 1)',
              'rgba(242,95,92, 1)',
              'rgba(255,224,102, 1)',
              'rgba(36,123,160, 1)',
              'rgba(172,127,141, 1)',
              'rgba(0, 0,0,1)',
              'rgba(214,40,40, 1)',
              'rgba(244,162,97, 1)',
              'rgba(0,168,232, 1)',
              'rgba(81,59,86, 1)'
            ],
            borderWidth: 1
          }
        ]
      },

      options: {

 scale: {
   display: false
 },
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 14,
                textAlign: 'center'
            }
        },
        ids: trackIds,
        onClick: function(e) {
          var element = topTracks.getElementAtEvent(e);
          if (element.length > 0) {
            let clickedElementindex = element[0]["_index"];
            chosenId = element[0]._chart.options.ids[clickedElementindex];
            trackName = element[0]._model.label;
          }
        },
        animation: {
          animateRotate: true,
          duration: 5000
        },
        scaleShowValues: false,
        scaleShowGridLines: false,

      }
    });
  }

  updateConfigByMutating(chart) {
    chart = topTracks;
    let {tracks} = this.props;
    let trackPopularity = tracks.map(track => track.popularity)
    let trackList = tracks.map(track => track.artists[0].name + ' - ' + track.name);
    let trackIds = tracks.map(track => track.id);
    // let artistsIds = tracks.map(track => track.artists[0].id)
     chart.options.title.text = 'new topTracks';
     chart.data.labels = trackList;
     chart.data.datasets[0].data = trackPopularity;
     chart.options.ids = trackIds;
     chart.update();
 }

  uponClickOnTrackRecommendation(i, e) {
    this.setState({
      currentClickedRecommendation: {
        preview_url: this.state.topTracksRecommendations.samples[i],
        name: this.state.topTracksRecommendations.nameAndTrack[i]
      }
    });
  }

  uponClickOnRecommendButton() {
    let recommendOptions = {
      "seed_genres": [this.state.topTracksGenres]
    }
    this.getRecommendationsBasedOnTopTracks(recommendOptions)
  }
  uponClick() {
    this.getTrackInfoAndRecommendation([chosenId], trackName)
  }

  render() {

    let topGenres = this.state.topTracksGenres;
    let topTracksRecommendations = this.state.topTracksRecommendations;
    let currentlyClicked = this.state.currentClickedRecommendation;
    return (<div id='topTracksContainer' className="container">
        <div className="empty-space"></div>

      <div className="wrapper text-center">
      <div className="grey-text">Want to choose a different time range for analysis?</div>
      <div className="btn-group">
      <button className='btn btn-primary btn-transparent' onClick={(e)=>{
        this.props.getMyTopTracks('short_term', this.updateConfigByMutating)
}
}>Click here for a shorter time range </button>
      <button className='btn btn-primary btn-transparent' onClick={(e)=>{
        this.props.getMyTopTracks('medium_term', this.updateConfigByMutating)
}
      }>Click here for a medium time range</button>
      <button className='btn btn-primary btn-transparent' onClick={(e)=>{
        this.props.getMyTopTracks('long_term', this.updateConfigByMutating)
}
}>Click here for a longer time range</button>
</div>
</div>
      {topGenres &&
        <div className="text-center wrapper">
        <button className='btn btn-secondary btn-white' onClick={(e) => this.uponClickOnRecommendButton(e)}>Click here (as many times as you like) to generate a playlist based on your favourite tracks
        </button>
        </div>
      }
      {topTracksRecommendations && topTracksRecommendations.topTracksRecommendationsUriList && <div className='top-tracks-recommendation-container' style={{paddingBottom: '50px'}}>
      {topTracksRecommendations.nameAndTrack}
        <button className="btn btn-primary center-block" onClick={(e) => {
          //create a playlist with recommended tracks, take the first artist name to create playlist name
          this.createPlaylist(topTracksRecommendations.topTracksRecommendationsUriList, topTracksRecommendations.nameAndTrack[0].props.children[0], "customized")
        }}>Click to save recommendations to playlist</button>
      </div>}
      {
        currentlyClicked && <div className='recommend-preview'>Listen to a preview of {currentlyClicked.name}
            <audio className='preview-track' src={currentlyClicked.preview_url} controls="controls">
              Your browser does not support the audio element.
            </audio>
          </div>
      }
      <div className="chart-container" style={{}}>
      <canvas width="1400" height="700" minwidth='200' onClick={(e) => this.uponClick(e)} id="topTracks"></canvas>
        </div>
    </div>)

  }
}
