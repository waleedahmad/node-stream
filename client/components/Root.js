import React from "react";
import {Router, Route} from 'react-router-dom';
import Navbar from './Navbar';
import LiveStreams from './LiveStreams';
import Settings from './Settings';

import VideoPlayer from './VideoPlayer';
import createBrowserHistory from "history/createBrowserHistory";
const customHistory = createBrowserHistory();

export default class Root extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            videoJsOptions : {
                autoplay: true,
                controls: true,
                sources: [{
                    src: 'http://127.0.0.1:8888/live/lorde/index.m3u8',
                    type: 'application/x-mpegURL'
                }]
            }
        }
    }

    render(){
        return (
            <Router history={customHistory} >
                <div>
                    <Navbar/>
                    <Route exact path="/" render={props => (
                        <LiveStreams  {...props} />
                    )}/>

                    <Route exact path="/stream" render={props => (
                        <VideoPlayer {...props} { ...this.state.videoJsOptions } />
                    )}/>
                    <Route exact path="/settings" render={props => (
                        <Settings {...props} />
                    )}/>
                </div>
            </Router>
        )
    }
}