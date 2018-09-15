import firebase from '../cloud/firebase'
import { database } from '../cloud/database';

function getPaths(data) {
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

// let promiseToGetData = new Promise( (resolve, reject) => {
//     //get info to draw drivers locations etc. on map
//             var uid = firebase.auth().currentUser.uid;
//             var data = [];
//             database.then( (d) => {
//                 var drivers = Object.keys(d.Users[uid].drivers);
//                 //TODO: find intersection of Drivers and the Drivers of a User to get list of driver uids that actually have a location assigned to them.
                
                
//                 for(var driver of drivers) {
//                 console.log(driver);
//                 if( d.Drivers[driver].currentLocation ) {
//                     data.push({ driver: driver, coordinates: d.Drivers[driver].coordinates, currentLocation:  d.Drivers[driver].currentLocation, profile: d.Drivers[driver].profile})
//                 }
//                 }
                
//                 return data
//             })
//             .then( (data) => {
                
                      
//                 resolve(data);
                
//             })
//             .catch( (err) => {reject(err)})
// })  

const initialState = {

    loading: false,
    loggedIn: false,
    uid: '',
    data: '3',
    paths: '',

}

//Taking the state and modifying it with some sort of action
const reducer = (state = initialState, action) => {
    const newState = {...state};

    switch(action.type) {
        case 'onSignInPress' :

            newState.loading = true;
            firebase.auth().signInWithEmailAndPassword(action.email, action.pass);
            newState.loggedIn = true;
            newState.loading = false;
            newState.uid = firebase.auth().currentUser.uid
            // var {uid} = newState;
            // promiseToGetData(uid, newState)
            // .then( (fromResolve) => { newState.data = fromResolve; newState.paths = getPaths(fromResolve); console.log(newState)  })
            break;
          
            
            
        // firebase.auth().signInWithEmailAndPassword(action.email, action.pass)
            //     .then( () => {
                    
            //         var bool = false;
            //         firebase.auth().onAuthStateChanged(
            //             (user) => {
            //                 if(user) { newState.loggedIn = true; newState.loading = false; return newState} 
            //                 else {console.log('no user found')}
            //             }
            //         )
                    
            //     })
            // return newState;
        
        
    }

    return newState;
    
}

export default reducer;