import React from 'react';
import videojs from 'video.js'
import axios from 'axios';
import config from '../../server/config/default';


export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stream: false,
            videoJsOptions: null
        }
    }

    componentDidMount() {

        axios.get('/user', {
            params: {
                username: this.props.match.params.username
            }
        }).then(res => {
            this.setState({
                stream: true,
                videoJsOptions: {
                    autoplay: false,
                    controls: true,
                    sources: [{
                        src: 'http://127.0.0.1:' + config.rtmp_server.http.port + '/live/' + res.data.stream_key + '/index.m3u8',
                        type: 'application/x-mpegURL'
                    }],
                    fluid: true,
                }
            }, () => {
                this.player = videojs(this.videoNode, this.state.videoJsOptions, function onPlayerReady() {
                    console.log('onPlayerReady', this)
                });
            });
        })
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto mt-5">
                    {this.state.stream ? (
                        <div data-vjs-player>
                            <video ref={node => this.videoNode = node} className="video-js vjs-big-play-centered"/>
                        </div>
                    ) : ' Loading ... '}
                </div>
            </div>
        )
    }
}