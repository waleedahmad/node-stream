const  path  = require('path');

const NodeMediaServer = require('node-media-server'),
    config = require('./config/default').rtmp_server,
    User = require('./database/Schema').User,
    helpers = require('./helpers/helpers'),
    MediaStoreUploader = require('./uploaders/mediastore'),
    chokidar = require('chokidar');

let nms = new NodeMediaServer(config);
// Let uploader = new S3BucketUploader(awsConfig.s3BucketName);
let uploader = new MediaStoreUploader();
let watchers = {};

const onFileWatch = (streamFolder) => async (event, path) => {
    try {
        let response = '';
        if(event === 'add' || event === 'change') {
            response = await uploader.uploadFilePath(path, streamFolder);
        }

        if (event === 'unlink') {
            response = await uploader.unlinkFilePath(path, streamFolder);
        }
        console.log(`Synced(${event}) ${path} to S3: as ${response}`);
    } catch(error) {
        console.log(`Cannot sync ${path} to S3: `, error);
    }
    console.log(event, path);
};

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

nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
    const watchFolder = path.join(config.http.mediaroot, StreamPath);
    watchers[id] = chokidar.watch(watchFolder);
    watchers[id].on('all', onFileWatch(StreamPath));
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('prePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('postPlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', async (id) => {
    await watchers[id].close().then(() => console.log(`Watcher ${id} is closed`));
    delete watchers[id];
    console.log('[NodeEvent on donePublish]', 'All files are uploaded to server');
});

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms;
