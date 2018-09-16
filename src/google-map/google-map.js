import React, {Component} from "react";
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import firebase from '../cloud/firebase.js';
import DriverDetails from './../text-input/DriverDetails';
//let database = firebase.database().ref('/');
const _ = require("lodash");
//const demoFancyMapStyles = require("./demoFancyMapStyles.json");
 
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
        //coords: [ [24.78, 67.08], [24.75, 67.09], [24.78, 67.06], [24.77, 67.07] ],
        coords: this.props.coords,
        time: this.props.time,
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
    
    componentWillReceiveProps() {
      const DirectionsService = new global.google.maps.DirectionsService();
      var waypts = [];
      for(var i = 1; i < this.state.coords.length - 1; i++) {
        waypts.push({
          location: this.state.coords[i],
          stopover: true
        })
      }
      if(this.state.coords.length == 2) {
        DirectionsService.route({ 
          origin: this.state.coords[0],
          destination: this.state.coords[1],
          travelMode: global.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: this.state.optimizeBoolean,
          provideRouteAlternatives: true,
          drivingOptions: { departureTime: this.state.time, trafficModel: 'pessimistic' }, 
          unitSystem: global.google.maps.UnitSystem.METRIC
    } , (result, status) => {
            if (status === global.google.maps.DirectionsStatus.OK) {
                this.setState({
                  directions: result,
            });
                console.log(result);
                //database.set({ route: [result]});
                //database.set({coordinates: this.state.coords})
          }  else {
                console.error(`error fetching directions ${result}`);
    }  }
    );
      }
      else {
        DirectionsService.route({ 
          origin: this.state.coords[0],
          destination: this.state.coords[this.state.coords.length - 1],
          waypoints: waypts,
          travelMode: global.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: this.state.optimizeBoolean,
          provideRouteAlternatives: true,
          drivingOptions: { departureTime: this.state.time, trafficModel: 'pessimistic' }, 
          unitSystem: global.google.maps.UnitSystem.METRIC
    } , (result, status) => {
            if (status === global.google.maps.DirectionsStatus.OK) {
                this.setState({
                  directions: result,
            });
                console.log(result);
                //database.set({ route: [result]});
                //database.set({coordinates: this.state.coords})
          }  else {
                console.error(`error fetching directions ${result}`);
    }  }
    );
    } 

    }
    
  }),
  withScriptjs,
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
        placeholder="Enter location here if you don't wish to use the markers"
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

  {
    props.isMarkerShown 
    &&
    props.coords.map((marker, index) => 
      <Marker key={index} position={{ lat: marker[0], lng: marker[1] }} onClick={ (e) => {console.log(e.latLng.lat())} } />
      
     )

  }

   {props.directions && <DirectionsRenderer directions={props.directions} />}
     

  </GoogleMap>
)

class MyGoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: false,
      address: '',
      geoDestination: '',
      coords: this.props.places,
      time: this.props.time,
    }
  }
  componentDidMount() {
    this.delayedShowMarker();
    
    //console.log(new global.google.maps.LatLng(35.137879, -82.836914));
  }

  confirmSelection = (uid, places, time) => {
    var postData = {
      coordinates: places,
      time: time,
      currentLocation: ''
    };

    //var newPostKey = firebase.database().ref().child('Drivers').push().key;
    
    var updates = {};
    updates['/Drivers/' + uid + '/'] = postData;

    return firebase.database().ref().update(updates);

  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 5000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    console.log('u')
    this.delayedShowMarker()
  }
  //fucking brilliant mate
  handleMarkerDrag = (e) => {
    console.log('stopped dragging');
    console.log(e.latLng.lat());
  }

  

  render() {
    
    console.log('Initializing Map Component');
    console.log(this.props.places)
    console.log(this.state.coords);
  
    
 
    return (
      
    <div>
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        onMarkerDragEnd={this.handleMarkerDrag}
        coords={this.state.coords}
        time={this.state.time}
      />
      <button onClick={() => this.confirmSelection(this.props.uid, this.props.places, this.props.time)}>
       CONFIRM 
      </button>
      
    </div>
      
      
      
    )
  }
}

export default MyGoogleMap;

{/* <button onClick={() => { 
                  firebase.database().ref('Users/'+this.props.uid+'/drivers/1').set(this.props.places);
                  console.log('pushed') }}>
        Confirm Route
      </button> */}

// class GoogleMap extends Component {

//     // shouldComponentUpdate() {
//     //     return false;
//     // }

//     componentDidMount() {
//         this.map = new global.google.maps.Map(this.refs.map, {
//             center: {lat: this.props.lat, lng: this.props.lng},
//             zoom: 8
//           });
          
//         this.poly =  new global.google.maps.Polyline({
//             strokeColor: '#000000',
//             strokeOpacity: 1,
//             strokeWeight: 3,
//             map: this.map
//           });
          
//         global.google.maps.event.addListener(this.map, 'click', function(event) {
//             this.AddLatLngToPoly(event.latLng, this.poly).bind(this);
//           });
//     }

//     AddLatLngToPoly(latLng, poly) {
//         var path = poly.getPath();
//         // Because path is an MVCArray, we can simply append a new coordinate
//         // and it will automatically appear
//         path.push(latLng);
      
//         // Update the text field to display the polyline encodings
//         //first encode the latlng path
//         var encodeString = global.google.maps.geometry.encoding.encodePath(path);
//         //now append it to the text field
//         if (encodeString) {
//            console.log(encodeString);
//         }
//       }

//     render() {
//         return (
//             <div style={{ height: '40vh' }} ref='map'/>
//         )
//     }

// }


//multiple routes require multiple calls of Directions Renderer:
// function drawMap() {

//   var directionDisplay;
//   var directionsService = new google.maps.DirectionsService();
//   var map;

// var start = new google.maps.LatLng(51.47482547819850,-0.37739553384529);
// var myOptions = {
// zoom:7,
// mapTypeId: google.maps.MapTypeId.ROADMAP,
// center: start
// }
// map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

// function renderDirections(result) { 
//   var directionsRenderer = new google.maps.DirectionsRenderer(); 
//   directionsRenderer.setMap(map); 
//   directionsRenderer.setDirections(result); 
// }     

// function requestDirections(start, end) { 
// directionsService.route({ 
//   origin: start, 
//   destination: end, 
//   travelMode: google.maps.DirectionsTravelMode.DRIVING 
// }, function(result) { 
//   renderDirections(result); 
// }); 
// } 

// requestDirections('(51.47482547819850,-0.37739553384529)', '(51.59512428598160,-0.17190814889409)'); 
// requestDirections('EC1V 0AH', '(51.47615506206120, -0.37795315370703)');  

// }

// export default GoogleMap

// POI.png
// POI.shadow.png
// arts.png
// arts.shadow.png
// bar.png
// bar.shadow.png
// blue-dot.png
// blue-pushpin.png
// blue.png
// bus.png
// bus.shadow.png
// cabs.png
// cabs.shadow.png
// camera.png
// camera.shadow.png
// campfire.png
// campfire.shadow.png
// campground.png
// campground.shadow.png
// caution.png
// caution.shadow.png
// coffeehouse.png
// coffeehouse.shadow.png
// convienancestore.png
// convienancestore.shadow.png
// cycling.png
// cycling.shadow.png
// dollar.png
// dollar.shadow.png
// drinking_water.png
// drinking_water.shadow.png
// earthquake.png
// earthquake.shadow.png
// electronics.png
// electronics.shadow.png
// euro.png
// euro.shadow.png
// fallingrocks.png
// fallingrocks.shadow.png
// ferry.png
// ferry.shadow.png
// firedept.png
// firedept.shadow.png
// fishing.png
// fishing.shadow.png
// flag.png
// flag.shadow.png
// gas.png
// gas.shadow.png
// golfer.png
// golfer.shadow.png
// green-dot.png
// green.png
// grn-pushpin.png
// grocerystore.png
// grocerystore.shadow.png
// groecerystore.png
// groecerystore.shadow.png
// helicopter.png
// helicopter.shadow.png
// hiker.png
// hiker.shadow.png
// homegardenbusiness.png
// homegardenbusiness.shadow.png
// horsebackriding.png
// horsebackriding.shadow.png
// hospitals.png
// hospitals.shadow.png
// hotsprings.png
// hotsprings.shadow.png
// info.png
// info.shadow.png
// info_circle.png
// info_circle.shadow.png
// landmarks-jp.png
// landmarks-jp.shadow.png
// lightblue.png
// lodging.png
// lodging.shadow.png
// ltblu-pushpin.png
// ltblue-dot.png
// man.png
// man.shadow.png
// marina.png
// marina.shadow.png
// mechanic.png
// mechanic.shadow.png
// motorcycling.png
// motorcycling.shadow.png
// movies.png
// movies.shadow.png
// msmarker.shadow.png
// orange-dot.png
// orange.png
// parkinglot.png
// parkinglot.shadow.png
// partly_cloudy.png
// partly_cloudy.shadow.png
// pharmacy-us.png
// pharmacy-us.shadow.png
// phone.png
// phone.shadow.png
// picnic.png
// picnic.shadow.png
// pink-dot.png
// pink-pushpin.png
// pink.png
// plane.png
// plane.shadow.png
// police.png
// police.shadow.png
// postoffice-jp.png
// postoffice-jp.shadow.png
// postoffice-us.png
// postoffice-us.shadow.png
// purple-dot.png
// purple-pushpin.png
// purple.png
// pushpin_shadow.png
// question.png
// question.shadow.png
// rail.png
// rail.shadow.png
// rainy.png
// rainy.shadow.png
// rangerstation.png
// rangerstation.shadow.png
// realestate.png
// realestate.shadow.png
// recycle.png
// recycle.shadow.png
// red-dot.png
// red-pushpin.png
// red.png
// restaurant.png
// restaurant.shadow.png
// sailing.png
// sailing.shadow.png
// salon.png
// salon.shadow.png
// shopping.png
// shopping.shadow.png
// ski.png
// ski.shadow.png
// snack_bar.png
// snack_bar.shadow.png
// snowflake_simple.png
// snowflake_simple.shadow.png
// sportvenue.png
// sportvenue.shadow.png
// subway.png
// subway.shadow.png
// sunny.png
// sunny.shadow.png
// swimming.png
// swimming.shadow.png
// toilets.png
// toilets.shadow.png
// trail.png
// trail.shadow.png
// tram.png
// tram.shadow.png
// tree.png
// tree.shadow.png
// truck.png
// truck.shadow.png
// volcano.png
// volcano.shadow.png
// water.png
// water.shadow.png
// waterfalls.png
// waterfalls.shadow.png
// webcam.png
// webcam.shadow.png
// wheel_chair_accessible.png
// wheel_chair_accessible.shadow.png
// woman.png
// woman.shadow.png
// yellow-dot.png
// yellow.png
// yen.png
// yen.shadow.png
// ylw-pushpin.png

// componentDidMount() {
//   const DirectionsService = new google.maps.DirectionsService();
//   DirectionsService.route({ 
//     origin: ,
//     destination: ,
//     travelMode: global.google.maps.TravelMode.DRIVING,
//    } , (result) => {this.setState({ directions: result  })} )
// }