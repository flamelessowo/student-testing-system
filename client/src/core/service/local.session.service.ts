import { LocalStorage } from 'quasar'

export function writeKey(newKey: string, value: string): void {
  LocalStorage.set(newKey, value);
}

export function writeObject(newKey: string, value: Object): void {
  LocalStorage.set(newKey, JSON.stringify(value));
}

export function getObject(key: string): object | null {
  return JSON.parse(LocalStorage.getItem(key) as string);
}

export function getValue(key: string) {
  return LocalStorage.getItem(key);
}

export function getStorageValue<T>(key: string, defaultValue: T): T {
  const value: string | null = LocalStorage.getItem(key);
  if (value !== null) {
      return value as T;
  }
  return defaultValue;
}

export function deleteKey(key: string) {
  LocalStorage.remove(key);
}
