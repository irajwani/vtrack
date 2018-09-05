import React, { Component } from 'react'
import SignIn from '../auth/SignIn'

import {connect} from 'react-redux';

import './HomePage.css';


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  render() {
    return (
      <div>
        <SignIn />
        {this.props.loggedIn ? 'yup' : 'nope'}
      </div>
    )
  }
}

// this feeds the singular store whenever the state changes
const mapStateToProps = (state) => {
  return {
      loggedIn: state.loggedIn,
  }
}

//if we want a component to access the store, we need to map actions to the props
const mapDispatchToProps = (dispatch) => {
  return {
      onSignInPress: (email, pass) => dispatch( {type: 'onSignInPress', email: email, pass: pass } ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

