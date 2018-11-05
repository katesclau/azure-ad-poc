import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { signIn, signOut } from '../common/azureHelper'
import { IdToken } from 'msal/lib-commonjs/IdToken';

class LoginFlow extends Component {
    constructor(props){
        super(props)

        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }
    handleSignIn() {
        signIn().then(IdToken => {
            console.log(IdToken);
        });
    }
    handleSignOut() {
        signOut();
    }
    render() {
        return (
            <div>
                <button onClick={this.handleSignIn}>Sign In</button>
                <button onClick={this.handleSignOut}>Sign Out</button>
            </div>
        )
    }
}

ReactDOM.render(<LoginFlow />, document.getElementById('app'))