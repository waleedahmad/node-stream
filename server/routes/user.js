const express = require('express'),
    router = express.Router(),
    User = require('../database/Schema').User;

router.get('/',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {

        if(req.query.username){
            User.findOne({
                username : req.query.username
            },(err, user) => {
                if (err)
                    return;
                if (user) {
                    res.json({
                        stream_key : user.stream_key
                    });
                }
            });
        }else{
            res.json({});
        }
    });

module.exports = router;

