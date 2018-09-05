import React, { Component } from 'react';

import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducer from './store/reducer.js'


import logo from './logo.svg';
import './App.css';
import { 
  toLatLon, toLatitudeLongitude, headingDistanceTo, moveTo, insidePolygon 
} from 'geolocation-utils'
import CustomRouter from './CustomRouter.js'
import {BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import HomePage from './home/HomePage'
import SignIn from './auth/SignIn.js';
import DriverDetails from './text-input/DriverDetails.js'
import MyGoogleMap from './google-map/google-map.js'
//gmaps API key: AIzaSyAfjr1IBlIDnLlgyburjhGXb0ZLW_uemmk
var names = []


const store = createStore(reducer);


class App extends Component {
  
  //Maybe I don't need to re-update the entire app every few seconds; perhaps 
  //I should isolate the update behavior to just the maps component
  // tick() {
  //   this.setState({
	// 	  currentTime: new Date()
	// 	});
  // }

  // componentDidMount() {
  //   this.timerID = setInterval(
	// 		() => this.tick(),
	// 		2000
	// 	  );
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timerID);
  // }

  

  render() {
    
    return (
      <Provider store={store}>
        <HomePage />
      </Provider>
      

      
    );
  }
}

export default App;

//when the person needs to leave
//check for route deviation between drivers
//check if deliveries were made on time
//check best possible route taken
