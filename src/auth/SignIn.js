import React, {Component} from 'react'
import firebase from '../cloud/firebase.js'
import Sentry from 'react-activity/lib/Sentry';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import 'react-activity/lib/Sentry/Sentry.css';
import DriverDetails from '../text-input/DriverDetails.js';
import './SignIn.css';
import {connect} from 'react-redux'

class SignIn extends Component {
    //only email and password managed by the state of this component.
    //Authentication is handled by global store which triggers this.props.loggedIn 
    constructor(props) {
        super(props);
        this.state = {email: '', pass: '',}
    }


    renderButtonOrLoading() {
        if (this.props.loading) {
            return <div>
                        <Sentry size='large' color="#0000ff"/>
                   </div>
        }
        return <Button variant="contained" color='primary' 
                        onClick={ () => { this.props.onSignInLoading ; this.props.onSignInPress(this.state.email, this.state.pass)} } >
                        Sign In
                </Button>;
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value})
    }

    handlePassChange(event) {
        this.setState({pass: event.target.value})
    }
    render() {

        const {loggedIn} = this.props
        
        if (loggedIn) {
            return (
                <DriverDetails />
            )
        }
        else {
            return (

                <div className="Container">
                
                <Paper >
                    <Avatar >
                        <LockIcon />
                    </Avatar>
                    <Typography variant="headline">Sign in</Typography>
                    <form >
                        <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input id="email" name="email" 
                            value={this.state.email} onChange={ (e) => this.handleEmailChange(e) }
                            autoComplete="email" autoFocus />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            name="password"
                            type="password"
                            value={this.state.pass} onChange={ (e) => this.handlePassChange(e) }
                            id="password"
                            autoComplete="current-password"
                        />
                        </FormControl>
                        {this.renderButtonOrLoading()}
                    </form>
                </Paper>

                {/* <input className="AuthInput" value={this.state.email} onChange={ (e) => this.handleEmailChange(e) } ref='email' type='text'/>
                <input className="AuthInput" value={this.state.pass} onChange={ (e) => this.handlePassChange(e)} ref='password' type='text'/>
                {this.renderButtonOrLoading()} */}


                </div>

            )
        }
    }

}

// this feeds the singular store whenever the state changes
const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        loggedIn: state.loggedIn,
    }
}

//if we want a component to access the store, we need to map actions to the props
const mapDispatchToProps = (dispatch) => {
    return {
        onSignInPress: (email, pass) => dispatch( {type: 'onSignInPress', email: email, pass: pass } ),
        //onSignInLoading: () => dispatch( {type: 'onSignInLoading'} )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)