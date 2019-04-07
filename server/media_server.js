const NodeMediaServer = require('node-media-server'),
    config = require('./config/default').node_media_server,
    User = require('./database/Schema').User;

nms = new NodeMediaServer(config);

nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${getStreamKeyFromStreamPath(StreamPath)} args=${JSON.stringify(args)}`);

    User.findOne({stream_key : stream_key}, (err, user) => {
        if(!err){
            if(!user){
                let session = nms.getSession(id);
                session.reject();
            }
        }
    });
});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms;
