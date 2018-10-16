import React from 'react';


export default class CustomizedTracks extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
  }


  render() {
    let customizedTrackList = this.props.tracks.map(track =>
      <div className='customized-track row '>
        <div id="customized-track-button" className="col" key={track.id}>{track.artists[0].name + ' - ' + track.name}
  </div>

  <audio className='preview-track col' key={track.preview_url} src={track.preview_url} controls="controls">
    Your browser does not support the audio element.
  </audio>

  </div>);


    return (
      <React.Fragment>
        {customizedTrackList}
        </React.Fragment>
      )

    }
  }
