import React, { Component } from 'react'
import SignIn from '../auth/SignIn'

import {connect} from 'react-redux';

import './HomePage.css';
import DriverDetails from '../text-input/DriverDetails';


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    const {uid, loggedIn} = this.props;
    
    return (
      <div>
        {this.props.loggedIn ? 
         <DriverDetails /> : <SignIn />}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

