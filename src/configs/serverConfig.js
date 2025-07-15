/**
 * Server Configuration
 * Centralized configuration for server IP and port
 * Change these values to update all API endpoints at once
 */

// VPS Server Configuration
export const SERVER_CONFIG = {
  IP: "14.225.192.15",
  PORT: "8085",
  PROTOCOL: "http",
};

// Derived URLs
export const BASE_URL = `${SERVER_CONFIG.PROTOCOL}://${SERVER_CONFIG.IP}:${SERVER_CONFIG.PORT}`;
export const API_BASE_URL = `${BASE_URL}/api`;
export const WEBSOCKET_URL = `${BASE_URL}/ws/chat`;

// Export individual components for flexibility
export const { IP, PORT, PROTOCOL } = SERVER_CONFIG;

// Default export for convenience
export default {
  SERVER_CONFIG,
  BASE_URL,
  API_BASE_URL,
  WEBSOCKET_URL,
  IP,
  PORT,
  PROTOCOL,
};
