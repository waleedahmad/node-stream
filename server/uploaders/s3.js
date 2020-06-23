const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class S3BucketUploader {
    constructor(bucketName) {
        this.bucketName = bucketName;
        this.bucketService = new AWS.S3({
            credentials: AWS.config.credentials
        });
    }

    async uploadFilePath(filePath, streamFolder) {
        const streamFolderBaseName = path.basename(streamFolder);
        const baseName = path.basename(filePath);
        const fileStream = this.readFileStream(filePath);
        const putRequest = {
            Bucket: this.bucketName,
            Key: `${streamFolderBaseName}/${baseName}`,
            Body: fileStream,
        };
        const response = await this.bucketService.upload(putRequest).promise();
        return response.Location;
    }

    async unlinkFilePath(filePath, streamFolder) {
        const streamFolderBaseName = path.basename(streamFolder);
        const baseName = path.basename(filePath);
        const putRequest = {
            Bucket: this.bucketName,
            Key: `${streamFolderBaseName}/${baseName}`,
        };
        await this.bucketService.deleteObject(putRequest).promise();
        return '';
    }

    readFileStream(filePath) {
        return fs.readFileSync(filePath);
    }
}

module.exports = S3BucketUploader;