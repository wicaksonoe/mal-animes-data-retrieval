import axios from 'axios';
import { MYANIMELIST_BASE_API_URL, MYANIMELIST_CLIENT_ID } from './config';

const http = axios.create({
  baseURL: MYANIMELIST_BASE_API_URL,
  headers: {
    'X-MAL-CLIENT-ID': MYANIMELIST_CLIENT_ID,
  },
});

export default http;
