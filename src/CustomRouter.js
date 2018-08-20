import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import MyGoogleMap from './google-map/google-map.js';

class CustomRouter extends Component {

    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li>
                        <Link to="/google-map/google-map.js"> Map </Link>
                        
                        </li>
                    </ul>

                    <hr />

                    <Route exact path="/google-map/google-map.js" component={MyGoogleMap} />
                    
                </div>
            
            
            </Router>
        )
    }


}

export default CustomRouter