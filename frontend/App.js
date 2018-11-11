import React from 'react'
import ReactDOM from 'react-dom'
import LoginFlow from './components/LoginFlow'
import Profile from './components/Profile'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { browserHistory } from 'react-router'

const Oops = () => <h2>Oops</h2>

const App = () => (
    <Router history={browserHistory}>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/me/">Profile</Link>
                    </li>
                </ul>
            </nav>
        
            <Route path="/" exact component={LoginFlow} />
            <Route path="/oops" component={Oops} />
            <Route path="/me" component={Profile} />
        </div>
    </Router>    
)

ReactDOM.render(<App />, document.getElementById('app'))