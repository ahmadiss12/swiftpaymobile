import { Platform } from 'react-native';

const defaultApiUrl = Platform.select({
  android: 'http://10.0.2.2:8000/api',
  default: 'http://localhost:8000/api',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || defaultApiUrl;
