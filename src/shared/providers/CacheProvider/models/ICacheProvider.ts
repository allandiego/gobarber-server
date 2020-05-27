export default interface ICacheProvider {
  set(key: string, value: any): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  destroy(key: string): Promise<void>;
  destroyPrefix(prefix: string): Promise<void>;
}
