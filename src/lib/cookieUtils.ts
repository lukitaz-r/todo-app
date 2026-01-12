import { v4 as uuidv4 } from 'uuid';

export const DEVICE_ID_COOKIE_NAME = 'deviceId';

/**
 * Retrieves the device ID from the browser cookies.
 * Recupera el ID del dispositivo de las cookies del navegador.
 * 
 * @returns {string | null} The device ID if found, null otherwise. / El ID del dispositivo si se encuentra, null en caso contrario.
 */
export function getDeviceId(): string | null {
  if (typeof document === 'undefined') return null; // Ensure we are on the client side / Asegurar que estamos en el cliente
  const match = document.cookie.match(new RegExp('(^| )' + DEVICE_ID_COOKIE_NAME + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

/**
 * Sets the device ID cookie with a 1-year expiration.
 * Establece la cookie del ID del dispositivo con una caducidad de 1 año.
 * 
 * @param {string} id - The unique ID to store. / El ID único a almacenar.
 */
export function setDeviceId(id: string) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1); // 1 year / 1 año
  document.cookie = `${DEVICE_ID_COOKIE_NAME}=${id}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Gets the existing device ID or creates a new one if it doesn't exist.
 * This is used to identify users without a traditional login system.
 * 
 * Obtiene el ID de dispositivo existente o crea uno nuevo si no existe.
 * Se usa para identificar usuarios sin un sistema de login tradicional.
 * 
 * @returns {string} The active device ID. / El ID de dispositivo activo.
 */
export function getOrCreateDeviceId(): string {
  let id = getDeviceId();
  if (!id) {
    id = uuidv4();
    setDeviceId(id);
  }
  return id;
}
