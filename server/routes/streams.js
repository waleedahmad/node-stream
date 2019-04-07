const express = require('express'),
    router = express.Router(),
    User = require('../database/Schema').User;

const spawn = require('child_process').spawn,
    cmd = '/usr/bin/ffmpeg';

router.get('/info',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {
        if(req.query.streams){
            let streams = JSON.parse(req.query.streams);
            let query = {$or: []};
            for (let stream in streams) {
                if (!streams.hasOwnProperty(stream)) continue;
                query.$or.push({stream_key : stream});
                generateStreamThumbnail(stream);
            }

            User.find(query,(err, users) => {
                if (err)
                    return;
                if (users) {
                    res.json(users);
                }
            });
        }
    });

const generateStreamThumbnail = (stream_key) => {
    const args = [
        '-y',
        '-i', 'rtmp://127.0.0.1/live/' + stream_key,
        '-ss', '00:00:01',
        '-vframes', '1',
        '-vf', 'scale=-2:300',
        'server/thumbnails/'+stream_key+'.png',
    ];

    const proc = spawn(cmd, args);

    proc.on('close', function() {
        console.log('finished');
    });
};

module.exports = router;

