const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { region, endpointPrefix } = require('../config/default').aws.mediaStore;

class MediaStoreUploader {
    constructor(bucketName) {
        this.bucketName = bucketName;
        this.service = new AWS.MediaStoreData({
            credentials: AWS.config.credentials,
            region,
            endpoint: `https://${endpointPrefix}.data.mediastore.${region}.amazonaws.com`,
        });
    }

    async uploadFilePath(filePath, streamFolder) {
        const streamFolderBaseName = path.basename(streamFolder);
        const baseName = path.basename(filePath);
        const fileStream = this.readFileStream(filePath);
        const putRequest = {
            Path: `${streamFolderBaseName}/${baseName}`,
            Body: fileStream,
            UploadAvailability: "STREAMING",
        };
        const response = await this.service.putObject(putRequest).promise();
        return response.ETag;
    }

    async unlinkFilePath(filePath, streamFolder) {
        const streamFolderBaseName = path.basename(streamFolder);
        const baseName = path.basename(filePath);
        const putRequest = {
            Path: `${streamFolderBaseName}/${baseName}`,
        };
        const response = await this.service.deleteObject(putRequest).promise();
        return response.error || 'SUCCESS';
    }

    readFileStream(filePath) {
        return fs.readFileSync(filePath);
    }
}

module.exports = MediaStoreUploader;