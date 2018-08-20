import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { 
  toLatLon, toLatitudeLongitude, headingDistanceTo, moveTo, insidePolygon 
} from 'geolocation-utils'
import CustomRouter from './CustomRouter.js'
import {BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';

import SignIn from './auth/SignIn.js';
import DriverDetails from './text-input/DriverDetails.js'
import MyGoogleMap from './google-map/google-map.js'
//gmaps API key: AIzaSyAfjr1IBlIDnLlgyburjhGXb0ZLW_uemmk
var names = []
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
      <Router>
      <div className="App">
        <header className="App-header">
    
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">DeliveryConfirmation</h1>
    
        </header>
    
        
        {/* <DriverDetails/>
        
        <CustomRouter/> */}
        <Route path="/" exact component={SignIn}/>
        <Route path="/Input" exact render={ () => { return ( <DriverDetails/> ) } }/>
        <Route path="/Input/OutputMap" exact render={ () => { return ( <MyGoogleMap/> ) } }/>
        
        
    
      </div>
      </Router>

      
    );
  }
}

export default App;

//when the person needs to leave
//check for route deviation between drivers
//check if deliveries were made on time
//check best possible route taken
