import React, { Component } from 'react';
import { Link } from 'react-router-dom';
let anchor;
 if (process.env.NODE_ENV != 'production') {
   anchor = 'http://www.localhost:5000'
 }
 else{
   anchor = process.env.PORT
 }


class Home extends Component {
  render() {
    return (
    <div className="App">
      <h1>Project Home</h1>

      <a href={anchor}>

            Log In
        </a>
    </div>
    );
  }
}
export default Home;
