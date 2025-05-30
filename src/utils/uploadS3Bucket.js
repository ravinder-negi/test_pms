// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
const REGION = process.env.REACT_APP_S3_REGION;
const ACCESS_KEY = process.env.REACT_APP_S3_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.REACT_APP_S3_SECRET_ACCESS_KEY;

const uploadFileToS3 = (file, bucketPath, type = false, mediaType) => {
  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  });

  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION
  });

  const params = {
    Bucket: S3_BUCKET,
    Key: bucketPath,
    Body: file,
    ContentType: file.type
  };
  if (type) {
    if (mediaType == 'Photo') {
      params.ContentDisposition = `attachment; filename="${file.name}"`;
    }
  } else {
    params.ContentDisposition = 'inline';
  }

  return s3
    .putObject(params)
    .on('httpUploadProgress', () => {
      // optional: track progress
    })
    .promise();
};

export const deleteS3Object = async (bucketPath) => {
  const s3bucket = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION // replace with your actual region
  });

  const params = {
    Bucket: S3_BUCKET,
    Key: bucketPath
  };

  return new Promise((resolve, reject) => {
    s3bucket.deleteObject(params, (err, data) => {
      if (err) {
        console.error('Image delete failed:', err);
        return reject(err);
      }
      resolve(data);
    });
  });
};

export const deleteMultipleS3Objects = async (keys = []) => {
  if (keys.length === 0) return;

  const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION
  });

  const params = {
    Bucket: S3_BUCKET,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
      Quiet: false
    }
  };

  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        console.error('Batch delete failed:', err);
        return reject(err);
      }
      resolve(data);
    });
  });
};

export default uploadFileToS3;
