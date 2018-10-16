import React from 'react';
import Slider, {Range, createSliderWithTooltip} from 'rc-slider';


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
export default class CustomizedFeaturesButtons extends React.Component {
  constructor() {
    super();
    this.state = {
      danceability_status: true,
      energy_status: true,
      speechiness_status: true,
      acousticness_status: true,
      instrumentalness_status: true,
      liveness_status: true,
      valence_status: true
    };

  }
  componentDidMount() {

  }



  render() {

    return (
      <div id="customizedButtonsContainer">
        <button className="btn" disabled={this.state.energy_status}>
          <p onClick={() => {
              this.setState(prevState => ({
                energy_status: !prevState.energy_status
              }));
              console.log(this.state);
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
                  console.log(this.state);
                }
    }/>
              <br/>
            </React.Fragment>
        }
        <button className="btn" disabled={this.state.instrumentalness_status}>
          <p onClick={() => {
              this.setState(prevState => ({
                instrumentalness_status: !prevState.instrumentalness_status
              }));
              console.log(this.state);
            }}>Instrumentalness</p>
        </button>
        {
          this.state.instrumentalness_status == false && <React.Fragment>
              <Slider.Range min={0} max={1} marks={marks} step={0.05} defaultValue={[0, 0.25]} onChange={(e) => {
                  let valueArr = e;
                  this.setState({min_instrumentalness: valueArr[0], max_instrumentalness: valueArr[1]})
                  console.log(this.state);
                }
    }/>
              <br/>
            </React.Fragment>
        }
        <button className="btn" disabled={this.state.liveness_status}>
          <p onClick={() => {
              this.setState(prevState => ({
                liveness_status: !prevState.liveness_status
              }));
              console.log(this.state);
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
        <button className="btn" disabled={this.state.valence_status}>
          <p onClick={() => {
              this.setState(prevState => ({
                valence_status: !prevState.valence_status
              }));
              console.log(this.state);
            }}>Valence</p>
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
        <button className="btn" disabled={this.state.speechiness_status}>
          <p onClick={() => {
              this.setState(prevState => ({
                speechiness_status: !prevState.speechiness_status
              }));
              console.log(this.state);
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

        
      </div>)

    }

  }
