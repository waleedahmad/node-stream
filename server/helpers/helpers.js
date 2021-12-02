const spawn = require('child_process').spawn,
    config = require('../config/default'),
    cmd = config.rtmp_server.trans.ffmpeg;

const generateStreamThumbnail = (stream_key) => {
    const args = [
        '-y',
        '-i', 'http://127.0.0.1:'+config.rtmp_server.http.port+'/live/'+stream_key+'/index.m3u8',
        '-ss', '00:00:01',
        '-vframes', '1',
        '-vf', 'scale=-2:300',
        'server/thumbnails/'+stream_key+'.png',
    ];

    spawn(cmd, args, {
        detached: true,
        stdio: 'ignore'
    }).unref();
};

module.exports = {
    generateStreamThumbnail : generateStreamThumbnail
};

