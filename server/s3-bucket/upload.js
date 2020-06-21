const AWS = require('aws-sdk');
const fs = require('fs');
const httpConfig = require('../config/default').rtmp_server.http;


class S3BucketUploader {
    constructor(bucketName) {
        this.bucketName = bucketName;
        this.bucketService = new AWS.S3({
            config: AWS.config.credentials
        });
    }

    async uploadStreamFolder(streamFolder) {
        const files = await this.getSortedFilesByDate(streamFolder);
        let savedS3Urls = [];
        for (let file of files) {
            const s3UrlPath = await this.uploadFile(file);
            savedS3Urls.push(s3UrlPath);
        }
        return savedS3Urls;
    }

    async getSortedFilesByDate(streamFolder) {
        const relativeFolderPath = `${httpConfig.mediaroot}${streamFolder}`;
        const s3Root = streamFolder.replace('/live/', '');
        const fileNames = fs.readdirSync(relativeFolderPath);
        const files = fileNames.map((filename) => {
            const relativePath =  `${relativeFolderPath}/${filename}`;
            const fileStream = this.readFileStream(relativePath);
            const dateModified = fs.statSync(relativePath);
            return {
                fileStream,
                s3version: `${s3Root}/${filename}`,
                path: relativePath,
                dateModified: dateModified.mtime.getTime(),
            };
        });
        return files.sort((a, b)  => a.dateModified - b.dateModified );
    }

    async uploadFile(file) {
        const putRequest = {
            Bucket: this.bucketName,
            Key: file.s3version,
            Body: file.fileStream,
        };
        const response = await this.bucketService.upload(putRequest).promise();
        console.log(`Successfully saved to ${response.Location}`);
        return response.Location;
    }

    readFileStream(filePath) {
        return fs.readFileSync(filePath);
    }
}

module.exports = S3BucketUploader;