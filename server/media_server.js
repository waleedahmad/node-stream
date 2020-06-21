const NodeMediaServer = require('node-media-server'),
    config = require('./config/default').rtmp_server,
    awsConfig = require('./config/default').aws,
    User = require('./database/Schema').User,
    helpers = require('./helpers/helpers'),
    S3BucketUploader = require('../server/s3-bucket/upload');

let nms = new NodeMediaServer(config);
let bucketUploader = new S3BucketUploader(awsConfig.s3BucketName);

nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    User.findOne({ stream_key: stream_key }, (err, user) => {
        if (!err) {
            if (!user) {
                let session = nms.getSession(id);
                session.reject();
            } else {
                helpers.generateStreamThumbnail(stream_key);
            }
        }
    });
});

nms.on('donePublish', async (id, StreamPath) => {
    await bucketUploader.uploadStreamFolder(StreamPath);
    console.log('[NodeEvent on doneConnect]', 'All files are uploaded to server');
});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms;
