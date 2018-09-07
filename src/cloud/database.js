import firebase from './firebase';

var database = firebase.database().ref().once('value')
.then(
    function(snapshot) { 
        const database = snapshot.val();
        
        return database
       } 
)


export {database};