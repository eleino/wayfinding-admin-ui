import type { AppInit } from '@apptypes/init';
import apiClient from './client';


export const initApp = async (): Promise<AppInit> => {
  const response = await apiClient.get('init/app');
  return response.json();
};