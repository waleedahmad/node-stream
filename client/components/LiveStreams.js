import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';


export default class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            live_streams: []
        }
    }

    componentDidMount() {
        this.getLiveStreams();
    }

    getLiveStreams(){
        axios.get('http://127.0.0.1:8888/api/streams')
            .then(res => {
                let streams = res.data;
                if (typeof (streams['live'] !== 'undefined')) {
                    this.getStreamsInfo(streams['live']);
                }
            });
    }

    getStreamsInfo(live_streams){
        axios.get('/streams/info' , {
            params : {
                streams : live_streams
            }
        }).then( res => {
            this.setState({
                live_streams : res.data
            }, () => {
                console.log(this.state);
            });
        });
    }

    render() {
        let streams = this.state.live_streams.map((stream , index) => {
            return (
                <div className="stream" key={index}>
                    <Link to={'/stream/' +  stream.username}>
                        {stream.username}
                    </Link>
                </div>
            );
        });
        
        return (
            <div className="container mt-5">
                <h4>Live Streams</h4>
                <hr className="my-4"/>

                <div className="streams">
                    {streams}
                </div>
            </div>
        )
    }
}