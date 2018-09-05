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

            firebase.auth().signInWithEmailAndPassword(action.email, action.pass)
                .then( () => {
                    
                    var bool = false;
                    firebase.auth().onAuthStateChanged(
                        (user) => {
                            if(user) { newState.loggedIn = true; newState.loading = false;return newState} 
                            else {console.log('no user found')}
                        }
                    )
                    
                })
                
                
            break;
        case 'onSignInLoading' :
                newState.loading = true;
                break;
        
        
    }
    
    return newState;
    
}

export default reducer;