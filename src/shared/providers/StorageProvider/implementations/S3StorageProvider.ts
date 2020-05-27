import aws, { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

import storageConfig from '@config/storage';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  public async save(file: string): Promise<string> {
    const originalPath = path.resolve(storageConfig.tempFolder, file);
    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new AppError('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: storageConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async delete(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: storageConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
