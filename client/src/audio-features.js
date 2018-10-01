import Chart from 'chart.js';
// import {getArtistInfoAndRecommendations} from './spotify_modules';
// import getMyTopArtists from './App';
import {getFeaturesById} from'./spotify_modules';
import React from 'react';

export default class AudioAnalysis extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.getFeaturesById = getFeaturesById.bind(this)

  }

  componentDidMount() {
  }


  render() {
    console.log('this is state chosentrackfeatures: ',this.state.chosenTrackFeatures);
    let chosenTrackArr = [];
    let topTracksForFeatures = this.props.tracks
    let trackIds = topTracksForFeatures.map(track => track.id);
    let trackNames = topTracksForFeatures.map(track => <button className="btn btn-secondary" style={{whiteSpace: 'normal'}} key={track.id} onClick={(e)=> this.getFeaturesById(track.id)}>{track.artists[0].name + ' - ' + track.name}</button>);

    return (
      <div id="audioFeaturesContainer">
      <div className="wrapper text-center">
      <div className="btn-group text-center">
        {trackNames}
      </div>
      { this.state.chosenTrackFeatures && <React.Fragment>
      <div>Energy: {this.state.chosenTrackFeatures.energy}</div>
      <div>Danceability: {this.state.chosenTrackFeatures.danceability}</div>
      </React.Fragment>
    }



    </div>
  </div>)

  }

}
