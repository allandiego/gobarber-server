import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  files: string[] = [];

  public async save(file: string): Promise<string> {
    this.files.push(file);

    return file;
  }

  public async delete(file: string): Promise<void> {
    this.files = this.files.filter(item => item !== file);
  }
}
