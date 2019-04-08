const express = require('express'),
    router = express.Router(),
    User = require('../database/Schema').User;

router.get('/info',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {
        if(req.query.streams){
            let streams = JSON.parse(req.query.streams);
            let query = {$or: []};
            for (let stream in streams) {
                if (!streams.hasOwnProperty(stream)) continue;
                query.$or.push({stream_key : stream});
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
module.exports = router;

