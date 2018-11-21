import React from 'react'
import { Component } from 'react'
import { signIn, signOut } from '../../common/azureHelper'
import axios from 'axios'

class LoginFlow extends Component {
    constructor(props) {
        super(props);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleSignIn() {
        signIn().then(IdToken => {
            console.log(IdToken);
        });
    }
    handleSignOut() {
        signOut();
    }
    handleLogin() {
        window.location.href = '/login';
    }
    handleLogout() {
        window.location.href = '/logout';
    }
    componentDidMount() {
        axios({
            url: `http://localhost:${process.env.PORT}/graphql`,
            method: 'post',
            data: {
                query: `query { me { name } }`
            },
            withCredentials: true
          }).then((result) => {
            console.log(result.data)
          });
    }
    render() {
        return (<div>
            <section id="azure-ad" style={{display: "none" }}>
                <h2>Azure AD Oauth2 Implicit Flow</h2>
                <button onClick={this.handleSignIn}>Sign In</button>
                <button onClick={this.handleSignOut}>Sign Out</button>
            </section>
            <section id="passport-login">
                <h2>OpenID Connect Flow</h2>
                <button onClick={this.handleLogin}>Login</button>
                <button onClick={this.handleLogout}>Logout</button>
            </section>
        </div>);
    }
}

export default LoginFlow