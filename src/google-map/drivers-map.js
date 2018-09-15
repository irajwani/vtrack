import React, {Component} from "react";
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer, Polyline, InfoWindow, Circle } from "react-google-maps";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database.js';
import {connect} from 'react-redux';

const _ = require("lodash");


var iconURLPrefix = 'http://maps.google.com/mapfiles/ms/icons/';

var icons = [
      iconURLPrefix + 'red-dot.png',
      iconURLPrefix + 'green-dot.png',
      iconURLPrefix + 'blue-dot.png',
      iconURLPrefix + 'orange-dot.png',
      iconURLPrefix + 'purple-dot.png',
      iconURLPrefix + 'pink-dot.png',      
      iconURLPrefix + 'yellow-dot.png'
    ];

 var car_icons = [
  require('../resources/img/red_car.png'),
  require('../resources/img/green_car.png'),
  require('../resources/img/blue_car.png'),
  require('../resources/img/orange_car.png')
 ]

var colors = [
  "#dd2f18", "#06a819", "#075aba", "#c97d0c", "#c10faf", "#e04c98", "#dbd962"
]

function renderSwitch(drivers,data) {
  //can't proceed until data comes in more fluidly
  if(drivers && data) {
    var actualData = data.filter( (obj) => { drivers.includes(obj.profile.name)  });
    console.log(actualData);
    
  }

  console.log('empty')
  console.log(drivers)
  console.log(data)
  
}

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAfjr1IBlIDnLlgyburjhGXb0ZLW_uemmk&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      //console.log(this.props);
      this.setState({
        bounds: null,
        center: {
          lat: 24.814994, lng: 67.061676
        },
        coords: [ [24.78, 67.08], [24.75, 67.09], [24.78, 67.06], [24.77, 67.07] ],
        optimizeBoolean: false,
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new global.google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },

    componentDidUpdate(prevProps) {
        if((prevProps.data !== this.props.data) && (prevProps.paths !== this.props.paths) && (prevProps.selectedDriver !== this.props.selectedDriver)) {
          this.setState( {data: this.props.data, paths: this.props.paths, selectedDriver: this.props.selectedDriver} )
        }
    },

    // componentWillReceiveProps() {
    //   this.setState( {data: this.props.data, paths: this.props.paths, selectedDriver: this.props.selectedDriver} )
    // },

    // componentDidMount() {
    //   this.setState( {data: this.props.data, paths: this.props.paths, selectedDriver: this.props.selectedDriver} )
    // }

    
  }),
  withGoogleMap,
    )//dot
    ((props) =>
  <GoogleMap
    ref={props.onMapMounted} //new
    defaultZoom={12}
    center={props.center} //new
    onPlacesChanged={props.onPlacesChanged} //new
  >
  {/* //1. Integration of SearchBox */}
  <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={global.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search for particular locations"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) => 
      <Marker key={index} position={marker.position} onClick={ (e) => {console.log(e.latLng.lat())} } />
    
    
    )}

  {/* //2. just a straight up marker */}
    
   {/* { props.isMarkerShown 
        && 
    <Marker position={{ lat: 24.814994, lng: 67.061676 }} icon={'http://maps.google.com/mapfiles/ms/icons/red-pushpin.png'}
            onClick={props.onMarkerClick} draggable={true} 
            onDragEnd={props.onMarkerDragEnd} />
    } */}

  
  {renderSwitch(props.selectedDriver, props.data)}

  {//objective markers designated to driver

    props.selectedDriver ? 

    props.isMarkerShown
    &&
    props.data.map( (m, parentIndex) => (
  
      
      
        m.coordinates.map( (c, childIndex) => (
      
        <Marker key={4*parentIndex + 7*childIndex}  
                position={{ lat: c.lat, lng: c.lng }} onClick={ props.onMarkerClick } 
                icon = { icons[parentIndex] } >
          
           
               {props.isWindowShown ? 
                  <InfoWindow key={4*parentIndex + 7*childIndex} position={{ lat: c.lat, lng: c.lng }} > 
                        <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
                          <div> {m.profile.name} has {c.done ? '' : 'not'} reached this place </div> 
                        </div>
                  </InfoWindow> : null }

            <Circle 
              center={ { lat: c.lat, lng: c.lng } } 
              radius={100} 
              options={ {
                fillColor:  c.done ? '#1350b2' : 'red',
                strokeColor: c.done ? '#61d8ab' : '#031430',
                strokeOpacity: c.done ? 1.0 : 0.5,
                strokeWeight: 1.0
              } }
            />

             
  
          </Marker>
  
      )

      
      
      )
      
      
    )
    )
    
    : //OR
    
    props.isMarkerShown
    &&
    props.data.map( (m, parentIndex) => (
  
      
      
        m.coordinates.map( (c, childIndex) => (
      
        <Marker key={4*parentIndex + 7*childIndex}  
                position={{ lat: c.lat, lng: c.lng }} onClick={ props.onMarkerClick } 
                icon = { icons[parentIndex] } >
          
           
               {props.isWindowShown ? 
                  <InfoWindow key={4*parentIndex + 7*childIndex} position={{ lat: c.lat, lng: c.lng }} > 
                        <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
                          <div> {m.profile.name} has {c.done ? '' : 'not'} reached this place </div> 
                        </div>
                  </InfoWindow> : null }

            <Circle 
              center={ { lat: c.lat, lng: c.lng } } 
              radius={100} 
              options={ {
                fillColor:  c.done ? '#1350b2' : '#031430',
                strokeColor: c.done ? '#61d8ab' : '#031430',
                strokeOpacity: c.done ? 1.0 : 0.5,
                strokeWeight: 1.0
              } }
            />

             
  
          </Marker>
  
      )

      
      
      )
      
      
    )
    )
  
  }

  { //directionsRenderer/polyline between markers
    props.isMarkerShown
    &&
    props.paths.map( (path, index) => (
      <Polyline
          path= {path}
          options = { {
                  geodesic: true,
                  strokeColor: colors[index],
                  strokeOpacity: 1.0,
                  strokeWeight: 2
                } }
      />
    )

    )
  }
  

  { //drivers currentLocation
    props.isMarkerShown

    &&

    props.data.map( (m, index) => (
      
          <Marker key={index} position={{ lat: m.currentLocation.lat, lng: m.currentLocation.lon }} 
            onClick={ (e) => {console.log(e.latLng.lat())} }
            icon = { car_icons[index] }  > 
          
        
            <InfoWindow key={index} position={{ lat: m.currentLocation.lat, lng: m.currentLocation.lon }}> 
              <div>
                <img src={m.profile.uri} alt={`${m.profile.name}`} width="75" height="75"/>
                <div>{m.profile.name}</div>
              </div>
            </InfoWindow> 

          </Marker>
    )
    )
  }
     

  </GoogleMap>
)

class DriversMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: false,
      isWindowShown: false, 
      address: '',
      geoDestination: '',
      //data: [ {currentLocation: {lat: 24.7767927372951, lon: 67.0902022139508} } ],
    }
  }
  componentDidMount() {
    this.delayedShowMarker();
    this.getDrivers();
    //console.log(new global.google.maps.LatLng(35.137879, -82.836914));
  }

  getDrivers() {
      //get info to draw drivers locations etc. on map
      var uid = firebase.auth().currentUser.uid;
      var data = [];
      database.then( (d) => {
        var drivers = Object.keys(d.Users[uid].drivers);
        //TODO: find intersection of Drivers and the Drivers of a User to get list of driver uids that actually have a location assigned to them.
        
        
        for(var driver of drivers) {
          console.log(driver);
          if( d.Drivers[driver].currentLocation ) {
            data.push({ driver: driver, coordinates: d.Drivers[driver].coordinates, currentLocation:  d.Drivers[driver].currentLocation, profile: d.Drivers[driver].profile})
          }
        }
        
        return data
      })
      .then( (data) => {
        this.setState( { data, paths: this.getPaths(data) } );        
      })
  }

  getPaths(data) {
    //get info to draw drivers locations etc. on map
    var result = [ ];
    for(let x=0; x < data.length; x++) {
      result.push( Array(0) );
    }
  
    for(let i =0;i<data.length;i++) {
      for(var c of data[i].coordinates) {
        result[i].push({lat: c.lat, lng: c.lng});
      }
    }
  
    return result
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 5000)
  }

  handleMarkerClick = () => {
    this.setState({ isWindowShown: !this.state.isWindowShown })
    console.log('u')
    this.delayedShowMarker()
  }
  //fucking brilliant mate
  handleMarkerDrag = (e) => {
    console.log('stopped dragging');
    console.log(e.latLng.lat());
  }

  

  render() {
    console.log('Initializing Driver Map Component');
    console.log(this.state.data);
    console.log(this.props.uid);
    console.log(this.props.selectedDriver)
    
    return (
      
    <div>
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        isWindowShown={this.state.isWindowShown}
        onMarkerClick={this.handleMarkerClick}
        onMarkerDragEnd={this.handleMarkerDrag}
        data={this.state.data}
        paths={this.state.paths}
        selectedDriver={this.props.selectedDriver}
      />
      <button onClick={() => this.getDrivers() }>
       REFRESH 
      </button>
      
    </div>
      
      
      
    )
  }
}

// this feeds the singular store whenever the state changes
const mapStateToProps = (state) => {
  return {
      loading: state.loading,
      loggedIn: state.loggedIn,
      uid: state.uid,
  }
}

//if we want a component to access the store, we need to map actions to the props
const mapDispatchToProps = (dispatch) => {
  return {
      //just a func to handle authentication, change the application state and store the UID
      onSignInPress: (email, pass) => dispatch( {type: 'onSignInPress', email: email, pass: pass } ),
      
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriversMap)


