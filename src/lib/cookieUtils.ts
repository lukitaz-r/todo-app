import { v4 as uuidv4 } from 'uuid';

export const DEVICE_ID_COOKIE_NAME = 'deviceId';

export function getDeviceId(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + DEVICE_ID_COOKIE_NAME + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function setDeviceId(id: string) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1); // 1 year
  document.cookie = `${DEVICE_ID_COOKIE_NAME}=${id}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

export function getOrCreateDeviceId(): string {
  let id = getDeviceId();
  if (!id) {
    id = uuidv4();
    setDeviceId(id);
  }
  return id;
}
