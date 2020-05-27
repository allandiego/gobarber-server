import fs from 'fs';
import path from 'path';
import storageConfig from '@config/storage';

import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async save(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(storageConfig.tempFolder, file),
      path.resolve(storageConfig.uploadsFolder, file),
    );

    return file;
  }

  public async delete(file: string): Promise<void> {
    const filePath = path.resolve(storageConfig.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
