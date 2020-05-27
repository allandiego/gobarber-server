import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class RedisCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async set(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async get<T>(key: string): Promise<T | null> {
    const response = this.cache[key];

    if (!response) {
      return null;
    }

    return JSON.parse(response) as T;
  }

  public async destroy(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async destroyPrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => delete this.cache[key]);
  }
}
