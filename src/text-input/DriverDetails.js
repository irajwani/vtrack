/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createGeoInput } from 'react-geoinput';
import MyGoogleMap from '../google-map/google-map.js'
import DriversMap from '../google-map/drivers-map.js'
import {connect} from 'react-redux';
import TimeField from 'react-simple-timefield';
import DateTimePicker from 'react-datetime-picker';

import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';

import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

//import {Redirect} from 'react-router-dom';

import styles from '../Demo.css';
import './DriverDetails.css'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const BarebonesGeoInput = ({
  addressInput,
  loadingGeoDestination,
  geoDestinationInput,
  onPredictionClick,
  predictions,
}) => (
  <div>
    <input {...addressInput} />

    {loadingGeoDestination && <div style={{ marginTop: 10 }}>Loading geo destination ...</div>}

    <hr />

    <div>
      <h3>
        predictions:
      </h3>

      <div>
        {!!predictions && !!predictions.length ? predictions.map((prediction, index) => (
          <div
            key={index}
            style={{ border: '1px solid #ccc', marginTop: 10, padding: 5, fontSize: 12 }}
          >
            {JSON.stringify(prediction)}

            <div style={{ marginTop: 10 }}>
              <button
                style={{ padding: 10 }}
                onClick={() => {onPredictionClick(index);
                                console.log(JSON.stringify(prediction));}}
              >
                Select
              </button>
            </div>
          </div>
        )) : '-'}
      </div>
    </div>

    <hr />

    <div>
      <h3>
        geoDestination value:
      </h3>
        
      <div>
        <pre>
          {geoDestinationInput.value
            ? JSON.stringify(geoDestinationInput.value, null, 2)
            : '-'}
        </pre>
      </div>
    </div>

  </div>
);

BarebonesGeoInput.propTypes = {
  addressInput: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  loadingGeoDestination: PropTypes.bool.isRequired,
  geoDestinationInput: PropTypes.shape({
    value: PropTypes.object,
  }).isRequired,
  onPredictionClick: PropTypes.func.isRequired,
  predictions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.node,
    onClick: PropTypes.func,
  })).isRequired,
};

const DemoInput = createGeoInput(BarebonesGeoInput);

class DriverDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      modalOpen: false,
      name: '',
      car: '',
      driver: [],
      selectedDriver: '',
      selectedTime: new Date(),
      address: '',
      geoDestination: undefined,
      data: [ {cartonID: 23850204, vehicleID: 'BGV-185', driverID: 'Imad Rajwani', coordinates: []}
            ],
      confirmed: false,
      showDrivers: false,
//{cartonID: 23850204, vehicleID: 'BGV-185', driverID: 'Imad Rajwani', coordinates: []},
    }
  }

  componentWillMount() {
    this.getDrivers();
  }

  getDrivers() {
    database.then( (d) => {
      const uid = firebase.auth().currentUser.uid;
      var drivers = d.Users[uid].drivers ;
      console.log(drivers);
      this.setState( {drivers} );
    })
    .catch( (error) => console.log(error))
  }

  onDriverChange = (selectedDriver) => {
    this.setState({selectedDriver});
    console.log(selectedDriver);
  }

  generateOptions = (data) => {
    var options = [{value: '', label: ''}];
    var entries = Object.entries(data);
    for(const [uid, name] of entries) {
      options.push({value: uid, label: name});
    }
    return options;
  }

  startOver() {
    this.state.data[this.state.data.length - 1].coordinates = [];
    //console.log(this.state.data[this.state.data.length - 1].coordinates)
  }

  onTimeChange = (selectedTime) => {
    //console.log(selectedTime);
    this.setState( {selectedTime}, console.log(selectedTime) );
  }

  onAddressChange = value => {this.setState({ address: value }); console.log(value)}

  onGeoDestinationChange = (val) => {
    //Account for if whether its the persons first entry with a simple length boolean
    //NOW ACCOUNT FOR WHEN PERSON JUST WANTS TO ADD ANOTHER LOCATION TO THE SAME FACE INPUTS
    
    console.log(this.state.data);
    //check if a new object altogether must be pushed to this.state.data
    let NoLocationBoolean = (this.state.data.length == 1)
    console.log('NoLocationBoolean is', NoLocationBoolean)
    if (NoLocationBoolean == true) {
      this.state.data.push({ 
        cartonID: this.refs.CartonIDBox.value, 
        vehicleID: this.refs.VehicleIDBox.value,
        coordinates: [ ]
        })
    }

    //check if this is persons first location chosen
    let FirstLocationBoolean = (this.state.data[this.state.data.length - 1].coordinates.length == 0)
    console.log('FirstLocationBoolean is', FirstLocationBoolean)

    //check if the last entry has only one coordinate appended to it so far
    let SecondLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
    (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) &
    (this.state.data[this.state.data.length - 1].coordinates.length == 1)
    console.log('SecondLocationBoolean is', SecondLocationBoolean)

    let ThirdLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
    (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) &
    (this.state.data[this.state.data.length - 1].coordinates.length == 2)
    console.log('ThirdLocationBoolean is', ThirdLocationBoolean)
    
    let FourthLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
    (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) &
    (this.state.data[this.state.data.length - 1].coordinates.length == 3)
    console.log('FourthLocationBoolean is', FourthLocationBoolean)

    let FifthLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
    (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) &
    (this.state.data[this.state.data.length - 1].coordinates.length == 4)
    console.log('FifthLocationBoolean is', FifthLocationBoolean)

    let SixthLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
    (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) &
    (this.state.data[this.state.data.length - 1].coordinates.length == 4)
    console.log('SixthLocationBoolean is', SixthLocationBoolean)

    if (FirstLocationBoolean == true) {
      this.state.data[this.state.data.length - 1].coordinates.push(
         {lat: val.location.lat, lng: val.location.lng, done: false} 
        )

    }

    if (SecondLocationBoolean == 1) {
      this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng, done: false });
    }

    if (ThirdLocationBoolean == 1) {
      this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng, done: false });
    }

    if (FourthLocationBoolean == 1) {
      this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng, done: false });
    }

    if (FifthLocationBoolean == 1) {
      this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng, done: false });
    }

    if (SixthLocationBoolean == 1) {
      this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng, done: false });
    }



    // if (this.state.data[this.state.data.length-1].cartonID.includes(this.refs.CartonIDBox.value) == )
    
    
    
    



    // if (moreLocationsBoolean == 1) {
    //   this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng });
    // }

    
    //FUCKING PROGRESS MATE
    
    // this.state.data.push({ 
    //   cartonID: this.refs.CartonIDBox.value, 
    //   vehicleID: this.refs.VehicleIDBox.value,
    //   driverID: this.refs.DriverIDBox.value,
    //   coordinates: [ {lat: val.location.lat, lng: val.location.lng} ]});

    
  
                                    }

  handleModal() {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updateFirebase(data) {
    var uid = firebase.auth().currentUser.uid;
    var updates = {};
    var postData = {name: data.name, car: data.car}
    var newPostKey = firebase.database().ref().child(`Users/${uid}/drivers`).push().key
    updates['/Users/' + uid + '/drivers/' + newPostKey + '/'] = postData;
    firebase.database().ref().update(updates);

    var driverUpdates = {};
    var driverData = {coordinates: '', currentLocation: '', distance_and_duration: '', profile: {name: data.name}, time: ''}
    updates['/Drivers/' + newPostKey + '/'] = driverData;
    firebase.database().ref().update(updates);
  }

  render() {
    console.log(this.state.drivers);
    
    if (this.state.confirmed) {
      return ( <MyGoogleMap places={this.state.data[this.state.data.length - 1].coordinates}
                            uid={this.state.selectedDriver.value}
                            time={this.state.selectedTime} /> 
             )
    }

  
    if(this.state.drivers){
    return (
        <div>
        
        <button onClick={() => {this.startOver();} } >
          Start Over
        </button>

        <Button variant="contained" color='primary' 
              onClick={ () => { this.setState({confirmed: true}) } } >
              Assign Route to Driver
        </Button>

        <Button variant="fab" mini color="secondary" aria-label="Add" 
          onClick={this.handleModal.bind(this)}>
          <AddIcon />
        </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={this.handleModal.bind(this)}
          >

          <form className="formContainer" noValidate autoComplete="off">
            <TextField
              required
              id="name"
              label="Name"
              className="textField"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
            />

            <TextField
              required
              multiline
              rowsMax="2"
              id="car"
              label="Car Model and Make"
              className="textField"
              value={this.state.car}
              onChange={this.handleChange('car')}
              margin="normal"
            />

            <Button variant="contained" color='green' 
              onClick={ () => { this.updateFirebase(this.state) } } >
              Create Driver Profile
            </Button>

          </form>


        </Modal>

        <DriversMap selectedDriver ={this.state.driver} />
        {/* <MyGoogleMap /> */}


        <FormControl >
          <InputLabel htmlFor="select-multiple-checkbox">Tag</InputLabel>
          <Select
            multiple
            value={this.state.driver}
            onChange={this.handleChange('driver')}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {Object.keys(this.state.drivers).map(key => (
              <MenuItem key={this.state.drivers[key].name} value={this.state.drivers[key].name}>
                <Checkbox checked={this.state.driver.indexOf(this.state.drivers[key].name) > -1} />
                <ListItemText primary={this.state.drivers[key].name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <p> Please Enter the ID for: </p>
                  <ul>
                      {"\n"}
                      <li> the goods being transported </li>
                      {"\n"}
                      <li> the vehicle delivering them, (probably the license plate)</li>
                      {"\n"}
                      <li> the driver transporting them</li>
                  </ul>

                  <input ref="CartonIDBox" type='text'/>
                  <input ref="VehicleIDBox" type='text'/>
                  
                  <DateTimePicker
                    onChange={this.onTimeChange}
                    value={this.state.selectedTime}
                  />

                  <DemoInput
                    addressInput={{
                      className: styles.addressInput,
                      onChange: this.onAddressChange,
                      value: this.state.address,
                    }}
                    geoDestinationInput={{
                      onChange: this.onGeoDestinationChange,
                      value: this.state.geoDestination,
                    }}
                  />

                  


                  
                  {/* <button onClick={() => { <Redirect to="/google-map/google-map.js" /> ;}}>
                  Yo
                  </button> */}

        </div>
      );

                }

      return (<div> Loading... </div> )
      
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

export default connect(mapStateToProps, mapDispatchToProps)(DriverDetails);


{/* <TimeField value={this.state.selectedTime} onChange={this.onTimeChange}
                  style = {{
                    border: '2px solid #666',
                    fontSize: 42,
                    width: 170,
                    padding: '5px 8px',
                    color: '#333',
                    borderRadius: 3
                  }} /> */}

// /* eslint-disable react/no-array-index-key */
// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { createGeoInput } from 'react-geoinput';
// import MyGoogleMap from '../google-map/google-map.js'
// //import {Redirect} from 'react-router-dom';

// import styles from '../Demo.css';

// const BarebonesGeoInput = ({
//   addressInput,
//   loadingGeoDestination,
//   geoDestinationInput,
//   onPredictionClick,
//   predictions,
// }) => (
//   <div>
//     <input {...addressInput} />

//     {loadingGeoDestination && <div style={{ marginTop: 10 }}>Loading geo destination ...</div>}

//     <hr />

//     <div>
//       <h3>
//         predictions:
//       </h3>

//       <div>
//         {!!predictions && !!predictions.length ? predictions.map((prediction, index) => (
//           <div
//             key={index}
//             style={{ border: '1px solid #ccc', marginTop: 10, padding: 5, fontSize: 12 }}
//           >
//             {JSON.stringify(prediction)}

//             <div style={{ marginTop: 10 }}>
//               <button
//                 style={{ padding: 10 }}
//                 onClick={() => {onPredictionClick(index);
//                                 console.log(JSON.stringify(prediction));}}
//               >
//                 Select
//               </button>
//             </div>
//           </div>
//         )) : '-'}
//       </div>
//     </div>

//     <hr />

//     <div>
//       <h3>
//         geoDestination value:
//       </h3>
        
//       <div>
//         <pre>
//           {geoDestinationInput.value
//             ? JSON.stringify(geoDestinationInput.value, null, 2)
//             : '-'}
//         </pre>
//       </div>
//     </div>

//   </div>
// );

// BarebonesGeoInput.propTypes = {
//   addressInput: PropTypes.shape({
//     onChange: PropTypes.func.isRequired,
//     value: PropTypes.string,
//   }).isRequired,
//   loadingGeoDestination: PropTypes.bool.isRequired,
//   geoDestinationInput: PropTypes.shape({
//     value: PropTypes.object,
//   }).isRequired,
//   onPredictionClick: PropTypes.func.isRequired,
//   predictions: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     label: PropTypes.node,
//     onClick: PropTypes.func,
//   })).isRequired,
// };

// const DemoInput = createGeoInput(BarebonesGeoInput);

// class DriverDetails extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//     address: '',
//     geoDestination: undefined,
//     data: [ {cartonID: 23850204, vehicleID: 'BGV-185', driverID: 'Imad Rajwani', coordinates: []}
//            ],
//     confirmed: false,
// //{cartonID: 23850204, vehicleID: 'BGV-185', driverID: 'Imad Rajwani', coordinates: []},
//     }
//   }

//   onAddressChange = value => this.setState({ address: value })

//   onGeoDestinationChange = (val) => {
//     //Account for if whether its the persons first entry with a simple length boolean
//     //NOW ACCOUNT FOR WHEN PERSON JUST WANTS TO ADD ANOTHER LOCATION TO THE SAME FACE INPUTS
    
//     console.log(this.state.data);
//     //check if a new object altogether must be pushed to this.state.data
//     let NoLocationBoolean = (this.state.data.length == 1)
//     console.log('NoLocationBoolean is', NoLocationBoolean)
//     if (NoLocationBoolean == true) {
//       this.state.data.push({ 
//         cartonID: this.refs.CartonIDBox.value, 
//         vehicleID: this.refs.VehicleIDBox.value,
//         driverID: this.refs.DriverIDBox.value,
//         coordinates: [ ]
//         })
//     }

//     //check if this is persons first location chosen
//     let FirstLocationBoolean = (this.state.data[this.state.data.length - 1].coordinates.length == 0)
//     console.log('FirstLocationBoolean is', FirstLocationBoolean)

//     //check if the last entry has only one coordinate appended to it so far
//     let SecondLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
//     (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) & 
//     (this.refs.DriverIDBox.value === this.refs.DriverIDBox.value) &
//     (this.state.data[this.state.data.length - 1].coordinates.length == 1)
//     console.log('SecondLocationBoolean is', SecondLocationBoolean)

//     let ThirdLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
//     (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) & 
//     (this.refs.DriverIDBox.value === this.refs.DriverIDBox.value) &
//     (this.state.data[this.state.data.length - 1].coordinates.length == 2)
//     console.log('ThirdLocationBoolean is', ThirdLocationBoolean)
    
//     let FourthLocationBoolean = ( this.refs.CartonIDBox.value === this.refs.CartonIDBox.value ) & 
//     (this.refs.VehicleIDBox.value === this.refs.VehicleIDBox.value) & 
//     (this.refs.DriverIDBox.value === this.refs.DriverIDBox.value) &
//     (this.state.data[this.state.data.length - 1].coordinates.length == 3)
//     console.log('FourthLocationBoolean is', FourthLocationBoolean)

//     if (FirstLocationBoolean == true) {
//       this.state.data[this.state.data.length - 1].coordinates.push(
//          {lat: val.location.lat, lng: val.location.lng} 
//         )
//     }

//     if (SecondLocationBoolean == 1) {
//       this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng });
//     }

//     if (ThirdLocationBoolean == 1) {
//       this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng });
//     }

//     if (FourthLocationBoolean == 1) {
//       this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng });
//     }


//     // if (this.state.data[this.state.data.length-1].cartonID.includes(this.refs.CartonIDBox.value) == )
    
    
    
    



//     // if (moreLocationsBoolean == 1) {
//     //   this.state.data[this.state.data.length - 1].coordinates.push({ lat: val.location.lat, lng: val.location.lng });
//     // }

    
//     //FUCKING PROGRESS MATE
    
//     // this.state.data.push({ 
//     //   cartonID: this.refs.CartonIDBox.value, 
//     //   vehicleID: this.refs.VehicleIDBox.value,
//     //   driverID: this.refs.DriverIDBox.value,
//     //   coordinates: [ {lat: val.location.lat, lng: val.location.lng} ]});

    
  
//                                     }

//   render() {
//     console.log(Object.values(this.props.drivers));
//     if (this.state.confirmed) {
//       return ( <MyGoogleMap places={this.state.data[this.state.data.length - 1].coordinates}  /> )
//     }
//       return (
//         <div>
//         <p> Welcome {this.props.name} </p>
        
//         <p> Please Enter the ID for: </p>
//                   <ul>
//                       {"\n"}
//                       <li> the goods being transported </li>
//                       {"\n"}
//                       <li> the vehicle delivering them, (probably the license plate)</li>
//                       {"\n"}
//                       <li> the driver transporting them</li>
//                   </ul>
          
//                   <input ref="CartonIDBox" type='text'/>
//                   <input ref="VehicleIDBox" type='text'/>
//                   <input ref="DriverIDBox" type='text'/>
//                   <DemoInput
//                     addressInput={{
//                       className: styles.addressInput,
//                       onChange: this.onAddressChange,
//                       value: this.state.address,
//                     }}
//                     geoDestinationInput={{
//                       onChange: this.onGeoDestinationChange,
//                       value: this.state.geoDestination,
//                     }}
//                   />
//                   <button onClick={() => this.setState({confirmed: true})}>
//                     Confirm Selection
//                   </button>
//                   {/* <button onClick={() => { <Redirect to="/google-map/google-map.js" /> ;}}>
//                   Yo
//                   </button> */}

//         </div>
//       );
      
//   }
// }

// export default DriverDetails;

