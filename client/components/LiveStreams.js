import React from 'react';
import axios from 'axios';

export default class Navbar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            live_streams : []
        }
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:8888/api/streams')
            .then(res =>{
                let streams = res.data;

                if(typeof(streams['live'] !== 'undefined')){
                    let live_streams = streams['live'];
                    for (let stream in live_streams) {
                        if(!live_streams.hasOwnProperty(stream)) continue;

                        console.log(stream);
                        console.log(live_streams[stream])
                    }
                }
            });
    }

    render() {
        return (
            <div className="container mt-5">
                <h4>Live Streams</h4>
                <hr className="my-4"/>

            </div>
        )
    }
}