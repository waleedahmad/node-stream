const AWS = require('aws-sdk');
const fs = require('fs');
const httpConfig = require('../config/default').rtmp_server.http;


class S3BucketUploader {
  constructor(bucketName) {
    this.bucketName = bucketName;
    this.bucketService = new AWS.S3({ config: AWS.config.credentials });
  }

  async uploadMp4FromStream(streamFolder, id) {
    const mp4FilePath = await this.getMp4FilePath(streamFolder);
    const s3UrlPath = await this.uploadFile(mp4FilePath, id);
    fs.rmdirSync(`${httpConfig.mediaroot}${streamFolder}`, { recursive: true });
    return s3UrlPath;
  }

  async getMp4FilePath(streamFolder) {
    const files = fs.readdirSync(`${httpConfig.mediaroot}${streamFolder}`);
    const mp4Files = files.filter((file) => file.match(/.*\.(mp4)/ig));
    const mp4File = mp4Files.reduce((a, b) => {
      return new Date(a) > new Date(b) ? a : b;
    });
    return `${httpConfig.mediaroot}${streamFolder}/${mp4File}`;
  }

  async uploadFile(filePath, id) {
    try {
      const fileStream = await this.readFileStream(filePath);
      const putRequest = { Bucket: this.bucketName, Key: `videos/${id}.mp4`, Body: fileStream };
      const response = await this.bucketService.upload(putRequest).promise();
      return response.Location;
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  async readFileStream(filePath) {
    const data = fs.readFileSync(filePath);
    return data;
  }
}

module.exports = S3BucketUploader;