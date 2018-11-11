import React from 'react'
import { Component } from 'react'
import axios from 'axios'

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            me: undefined
        }
    }
    componentDidMount() {
        axios({
            url: `http://localhost:${process.env.PORT}/graphql`,
            method: 'post',
            data: {
              query: `query { me }`
            }
        }).then( result => {
            const me = result.data.data.me
            console.log(me)
            this.setState({
                me: me
            })
        });
    }
    render() {
        if (this.state.me) {
            return <p>Hi {this.state.me} 🙋‍ - btw, this data is provided by a secure graphql endpoint! 🔐</p>
        } else {
            return <p>Please Login</p>
        }
    }
}

export default Profile