import React, { Component } from 'react'
import PropTypes from 'prop-types'


export default class ModalDriverProfile extends Component {
  static propTypes = {
    //open: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired
  }

  constructor(props) {
      super(props);
      this.state = { modalOpen: false, }
  }

  

  render() {
      console.log(this.props.handleModal)
    return (
        
    )
  }
}
