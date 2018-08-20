import React, {Component} from 'react'
import firebase from '../cloud/firebase.js'
import Sentry from 'react-activity/lib/Sentry';
import 'react-activity/lib/Sentry/Sentry.css';
import DriverDetails from '../text-input/DriverDetails.js';

export default class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {email: '', pass: '', uid: '', loading: false, loggedIn: false, isGetting: true}
    }

    getData(snapshot) {
        var details;
        details = {
            name: 'the many faced God',
            drivers: 'none'
        };
        
        details.name = snapshot.val().name;
        details.drivers = snapshot.val().drivers;
        //details.attended = snapshot.val().attended
        //console.log(details);
        this.setState({details, isGetting: false});
    }

    getDB(snapshot) {
        this.setState({data: snapshot.val()});
        console.log(this.state.data);
    }

    onSignInPress() {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state; //now that person has input text, their email and password are here
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(() => { this.setState({ error: '', loading: false });
                          this.authChangeListener();
                          //cant do these things:
                          //firebase.database().ref('Users/7j2AnQgioWTXP7vhiJzjwXPOdLC3/').set({name: 'Imad Rajwani', attended: 1});
                          }).catch(() => {
                firebase.auth().createUserWithEmailAndPassword(email, pass)
                    .then(() => { this.setState({ error: '', loading: false });
                                  this.authChangeListener();  }
                                      )
                    .catch(() => {
                      // console.log( 'registration error', error )
                      // if (error.code === 'auth/email-already-in-use') {
                      //       var credential = firebase.auth.EmailAuthProvider.credential(email, password);
                      //
                      //
                      // }

                      this.setState({ error: 'Authentication failed, booo hooo.', loading: false });
                    });
            });

    }

    authChangeListener() {

        firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
                var name = 'nothing here';
                firebase.database().ref('Users/').once('value', this.getDB.bind(this), function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                  });

                firebase.database().ref('Users/' + user.uid + '/').once('value', this.getData.bind(this), function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                  });
                this.setState({uid: user.uid, loggedIn: true});
                //console.log(this.state.name);
                //alert(this.state.uid);
                //return this.props.navigation.navigate('ga', {userid: this.state.uid});
                //if (this.state.isGetting == false) {return this.props.navigation.navigate('ga', {data: this.state.data, attended: this.state.details.attended, name: this.state.details.name, userid: this.state.uid}); //abandon forced navigation. conditional render
            
                
            } else {
              alert('no user found');
            }


        } )


                  }

    renderButtonOrLoading() {
        if (this.state.loading) {
            return <div>
                        <Sentry size='large' color="#0000ff"/>
                   </div>
        }
        return <button name='Sign In' onClick={ this.onSignInPress.bind(this) } />;
    }

    render() {
        
        if (this.state.isGetting == false) {
            return ( <DriverDetails name={this.state.details.name} drivers={this.state.details.drivers}/> )
        }
        else {
            return (

                <div>
                
                <input value={this.state.email} onChange={ (event) => this.setState({ email: event.target.value }) } ref='email' type='text'/>
                <input value={this.state.pass} onChange={ (event) => this.setState({ pass: event.target.value }) } ref='password' type='text'/>
                {this.renderButtonOrLoading()}


                </div>

            )
        }
    }

}