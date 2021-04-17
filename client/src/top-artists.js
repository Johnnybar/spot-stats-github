import Chart from 'chart.js';
import {getArtistInfoAndRecommendations, createPlaylist} from './spotify_modules';
// import getMyTopArtists from './App';
import React from 'react';
// import SpotifyWebApi from 'spotify-web-api-js';
// const spotifyApi = new SpotifyWebApi();

let chosenId, topArtists;

export default class TopArtists extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.uponClick = this.uponClick.bind(this);
    this.getArtistInfoAndRecommendations = getArtistInfoAndRecommendations.bind(this);
    this.createPlaylist = createPlaylist.bind(this);
    this.updateConfigByMutating = this.updateConfigByMutating.bind(this);
  }

  componentDidMount() {

    let {artists} = this.props;
    let artistNames = artists.map(artist => artist.name);
    let artistPopularity = artists.map(artist => artist.popularity);
    let artistIds = artists.map(artist => artist.id);

    let ctx = document.getElementById("topArtists").getContext('2d');
     topArtists = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: artistNames,
        datasets: [
          {
            label: 'Popularity',
            data: artistPopularity,
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
        showTooltips: true,
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 14,
                textAlign: 'center'
            }
        },
        legend: {
          onHover: function (e) {
            e.target.style.cursor = 'pointer';
          }
        },
        hover: {
          onHover: function (e) {
            var point = this.getElementAtEvent(e);
            if (point.length) e.target.style.cursor = 'pointer';
            else e.target.style.cursor = 'default';
          }
        },
maintainAspectRatio: false,
        ids: artistIds,
        onClick: function(e) {
          var element = topArtists.getElementAtEvent(e);
          if (element.length > 0) {
            let clickedElementindex = element[0]["_index"];
            // let label = topArtists.data.labels[clickedElementindex];
            chosenId = element[0]._chart.options.ids[clickedElementindex]
          }
        },
        animation: {
          animateRotate: true,
          duration: 5000
        },
        scaleShowValues: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                autoSkip: false
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false
              }
            }
          ]
        }
      }
    });

  }

 updateConfigByMutating(chart) {
   chart = topArtists;
   let {artists} = this.props;
   let artistNames = artists.map(artist => artist.name);
   let artistPopularity = artists.map(artist => artist.popularity);
   let artistIds = artists.map(artist => artist.id);
    chart.options.title.text = 'new topArtists';
    chart.data.labels = artistNames;
    chart.data.datasets[0].data = artistPopularity;
    chart.options.ids = artistIds;
    chart.update();
}

  uponClick(e) {
    this.getArtistInfoAndRecommendations([chosenId]);
    //Get rid of previously selected preview track when loading a new artist from chart
    if(this.state.currentClickedTrack){
    this.setState(function(prevState, props){
        return {currentClickedTrack: !prevState.currentClickedTrack}
     })};
  }
  uponClickOnRecommendation(i, e) {
    let indexOfClickedRecommendation = i;
    let clickedOne = this.state.recommendations.samples[i];
    this.setState({currentClickedTrack: clickedOne, indexOfClickedRecommendation: indexOfClickedRecommendation})
  }

  render() {
    let artistInfo = this.state.artistInfo;
    let sampleTrack = this.state.sampleTrack;
    let recommendations = this.state.recommendations
  
    let selectedTrack = this.state.currentClickedTrack
    let indexOfClickedRecommendation = this.state.indexOfClickedRecommendation;

    return (<div id="topArtistsContainer">
      <div className="wrapper text-center">
      <div className="grey-text">Want to choose a different time range for analysis?</div>
      <div className="btn-group text-center">
      <button type="button" className="btn btn-secondary btn-transparent" onClick={(e)=>{
        this.props.getMyTopArtists('short_term', this.updateConfigByMutating)
}
}>Click here for a shorter time range </button>
      <button type="button" className="btn btn-secondary btn-transparent" onClick={(e)=>{
        this.props.getMyTopArtists('medium_term', this.updateConfigByMutating)
}
      }>Click here for a medium time range</button>
      <button type="button" className="btn btn-secondary btn-transparent" onClick={(e)=>{
        this.props.getMyTopArtists('long_term', this.updateConfigByMutating)
}
}>Click here for a longer time range</button>
</div>
</div>
      {
        artistInfo && <div className='chosen-artist-container'>
            <div className='artist-name grey-text'>{artistInfo.name}</div>
            <img alt='artist-img' className='artist-image' src={artistInfo.image}/>
            `<p className="grey-text">Here is a short clip of {artistInfo.name}'s music</p>`
            <audio className='preview-track' src={sampleTrack} controls="controls">
              Your browser does not support the audio element.
            </audio>

          </div>
      } {
        recommendations && <div className='recommendation-container'>
            <h2 className="grey-text" style={{textAlign: 'center'}}>Here are some track recommendations based on {artistInfo.name}</h2>
            <div className='artists-recommendations'>
              {recommendations.nameAndTrack}
            </div>

          
          </div>
      } 
      {
        recommendations && recommendations.recommendationTrackIds && <button className="btn btn-primary center-block" onClick={(e) => {
          //create a playlist with recommended tracks, take the first artist name to create playlist name
          this.createPlaylist(recommendations.recommendationTrackIds, artistInfo.name, "recommendations")
        }
        }>Create a spotify playlist with these recommendations</button>
      }
      {
        selectedTrack && sampleTrack && <div className='recommend-preview'>Check out a preview of {recommendations.nameAndTrack[indexOfClickedRecommendation]} <audio className='preview-track' src={selectedTrack} controls="controls">
              Your browser does not support the audio element.
            </audio>
          </div>
      }
      <div className="chart-container" style={{}}>
      <canvas minwidth= '200' width='300' height='600' onClick={(e)=> this.uponClick(e)} id="topArtists" ></canvas>
        </div>

  </div>)

  }

}
