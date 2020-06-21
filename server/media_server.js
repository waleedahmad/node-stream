const NodeMediaServer = require('node-media-server'),
  config = require('./config/default').rtmp_server,
  awsConfig = require('./config/default').aws,
  User = require('./database/Schema').User,
  helpers = require('./helpers/helpers'),
  S3BucketUploader = require('../server/s3-bucket/upload');

nms = new NodeMediaServer(config);
bucketUploader = new S3BucketUploader(awsConfig.s3BucketName);

let streams = {};

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
      streams[id] = StreamPath
    }
  });
});

nms.on('doneConnect', async (id, args) => {
  let currentStreamPath = streams[id];
  const savedFile = await bucketUploader.uploadMp4FromStream(currentStreamPath, id);
  console.log('[NodeEvent on doneConnect]', `Stream was uploaded to ${savedFile}`);
  delete streams[id];
});

const getStreamKeyFromStreamPath = (path) => {
  let parts = path.split('/');
  return parts[parts.length - 1];
};

module.exports = nms;
