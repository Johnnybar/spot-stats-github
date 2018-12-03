import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import scrollIntoView from 'scroll-into-view';
const spotifyApi = new SpotifyWebApi();

let trackIds;
// let customizedTracks;
// let customizedTrackList;
// let customizedSample;


export function getArtistInfoAndRecommendations(id) {

  spotifyApi.getArtists(id).then((response) => {
    this.setState({
      artistInfo: {
        image: response.artists[0].images[1].url,
        name: response.artists[0].name,
        genres: response.artists[0].genres
      }
    })
    spotifyApi.getArtistTopTracks(id, 'DE').then((response) => {
      trackIds = response.tracks.map((track) => track.id)
      this.setState({sampleTrack: response.tracks[0].preview_url, trackIds: trackIds})
      let genresArr = this.state.artistInfo.genres.slice(0, 4);
      let recommendOptions = {
        "seed_genres": [genresArr],
        "seed_artists": [id]
      }
      spotifyApi.getRecommendations(recommendOptions).then((response) => {
        let recommendationNames = response.tracks.filter(each => each.preview_url !== null).map(function(recommendations, i) {
          return (<button id="round-button" className="btn btn-secondary" style={{whiteSpace: 'normal'}} key={i} onClick={this.uponClickOnRecommendation.bind(this, i)}>
            {recommendations.artists[0].name + ' - '}
            <br></br>
            {recommendations.name}
          </button>);
        }, this);
        recommendationNames = recommendationNames.slice(0, 8);
        let recommendationSampleTrack = response.tracks.filter(each => each.preview_url !== null).map(eachRecommendation => eachRecommendation.preview_url).slice(0, 8);
        this.setState({
          recommendations: {
            nameAndTrack: recommendationNames,
            samples: recommendationSampleTrack
          }
        })
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }).catch(err => console.log(err));
}


export function getRecommondationGenres(artistsIds){
  spotifyApi.getArtists(artistsIds).then((response) => {
    function getGenresRandomly(obj) {
      let genreArr = [];
      if (genreArr.length === 5) {
        return genreArr;
      }
      let i = 0;
      for (let prop in obj) {
        for (let eachArtist of obj[prop]) {
          if (eachArtist.genres.length > 0) {
            if (eachArtist.genres[i] !== undefined) {
              genreArr.push(eachArtist.genres)
              i++
            }
          }
        }
      }
      return genreArr;
    }
    //five random genres based on all artists
    let genreArrOfArrays = getGenresRandomly(response);
    var genresFound = [].concat.apply([], genreArrOfArrays).join().replace(/[',']/g, ' ').split(' ')

    spotifyApi.getAvailableGenreSeeds().then((response)=>{
      let finalGenres = [];
      // function getRandomArbitrary(min, max) {
      //   return Math.random() * (max - min) + min;
      // }
      for (let i = 0; i < genresFound.length; i++) {
        if(response.genres.indexOf(genresFound[i]) !== -1 && finalGenres.indexOf(genresFound[i]) === -1){
        finalGenres.push(genresFound[i])
        }
      }
      //for now, just push 5 genres...
      this.setState({topTracksGenres:finalGenres.slice(0,5)})
    })
  }).catch(err => console.log(err))
}

export function getTrackInfoAndRecommendation(id, trackName){
  spotifyApi.getTrack(id).then((response) => {
    this.setState({
      trackInfo: {
        topTrackSample: response.preview_url,
        topTrackName: trackName
      }
    })
  }).catch(err => console.log(err));
}


export function getRecommendationsBasedOnTopTracks(genres){
  spotifyApi.getRecommendations(genres).then((response) => {
    //20 tracks based on the 5 genres provided
    let recommendationNames = response.tracks.filter(each => each.preview_url !== null).map(function(recommendations, i) {
      console.log(recommendations);
      return (<button key={i} onClick={this.uponClickOnTrackRecommendation.bind(this, i)} id="round-button" className="btn btn-secondary" style={{whiteSpace: 'normal'}}>
        {recommendations.artists[0].name + ' - '}
        <br></br>
        {recommendations.name}
      </button>);
    },this);
    recommendationNames = recommendationNames.slice(0, 8);
    let recommendationSampleTrack = response.tracks.filter(each => each.preview_url !== null).map(eachRecommendation => eachRecommendation.preview_url).slice(0, 8);
    this.setState({
      topTracksRecommendations: {
        nameAndTrack: recommendationNames,
        samples: recommendationSampleTrack
      }
    })
  }).catch(err => console.log(err))
}

export function getFeaturesById(id){
  spotifyApi.getAudioFeaturesForTrack(id).then((response) => {
this.setState({
  chosenTrackFeatures: response
}, scrollIntoView(document.getElementById("featuresChart")))
}).catch(err => console.log(err))
}
