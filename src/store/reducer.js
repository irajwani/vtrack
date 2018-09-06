import firebase from '../cloud/firebase'

const initialState = {
    loading: false,
    loggedIn: false,
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