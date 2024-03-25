import axios from 'axios';
import { ASP_NET_URI } from '../constants'

export const axiosProtected = axios.create({
  baseURL: ASP_NET_URI  
});
