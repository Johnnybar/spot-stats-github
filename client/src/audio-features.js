import Chart from 'chart.js';
// import {getArtistInfoAndRecommendations} from './spotify_modules';
// import getMyTopArtists from './App';
import {getFeaturesById} from'./spotify_modules';
import React from 'react';

export default class AudioFeatures extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.getFeaturesById = getFeaturesById.bind(this)

  }

  componentDidMount() {

  }

  render() {
    let chosenTrackArr = [];
    let topTracksForFeatures = this.props.tracks
    let trackIds = topTracksForFeatures.map(track => track.id);
    let labelArr = [];
    let dataArr = [];
    for (var key in this.state.chosenTrackFeatures) {
        if(this.state.chosenTrackFeatures[key]>0 && this.state.chosenTrackFeatures[key]<1){
        labelArr.push(key);
        dataArr.push(this.state.chosenTrackFeatures[key])
      }
};

    let trackNames = topTracksForFeatures.map(track => <button className="btn btn-secondary" style={{whiteSpace: 'normal'}} key={track.id} onClick={(e)=> this.getFeaturesById(track.id)}>{track.artists[0].name + ' - ' + track.name}</button>);
    if(this.state.chosenTrackFeatures){

      let ctx = document.getElementById("featuresChart").getContext('2d');
       let featuresChart = new Chart(ctx, {
       type: 'doughnut',
       data: {
         labels: labelArr,
         datasets: [
           {
             data: dataArr,
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
               'rgba(81,59,86, 0.9)',
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
               'rgba(81,59,86, 1)',
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
         ids: trackIds,
         animation: {
           animateRotate: true,
           duration: 5000
         },
         scaleShowValues: false,
         scaleShowGridLines: false,
         scales: {
           yAxes: [
             {
               ticks: {
                 beginAtZero: true,
                 autoSkip: false,
                 display: false
               }
             }
           ],
           xAxes: [
             {
               ticks: {
                 autoSkip: false,
                 display: false
               }
             }
           ]
         }
       }
     });
    }
    return (
      <div id="audioFeaturesContainer">
      <div className="wrapper text-center">
      <div className="btn-group text-center">
      {trackNames}
      </div>



      </div>
      <canvas id="featuresChart" style={{
        "width" : "100",
        "height" : "100"
      }}></canvas>
      </div>)

    }

  }
