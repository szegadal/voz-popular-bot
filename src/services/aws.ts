import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import path from 'path';

const s3 = new S3Client({ region: 'us-east-1' });

const bucketName = process.env.BUCKET_NAME;

export async function storeFileInAws(pathOfLocalFile: string, pathToStoreFile: string = '') {
  try {
    console.log('Calling storeFileInAws');
    const fileName = path.basename(pathOfLocalFile);

    const key = `${pathToStoreFile}${fileName}`;
    const fileStream = fs.createReadStream(pathOfLocalFile);
    fileStream.on('error', (err) => {
      console.log('File Error', err);
    });

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
    };

    const command = new PutObjectCommand(uploadParams);

    const res = await s3.send(command);
    console.log(res);
  } catch (err: any) {
    err.name = 'storeFileException';
    throw err;
  }
}
