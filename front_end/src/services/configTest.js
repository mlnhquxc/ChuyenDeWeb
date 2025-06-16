// Test file to check if the config import is working correctly
import { API_URL, ENDPOINTS } from '../config';

console.log('Config Test - API_URL:', API_URL);
console.log('Config Test - ENDPOINTS:', ENDPOINTS);
console.log('Config Test - CART ENDPOINTS:', ENDPOINTS?.CART);
console.log('Config Test - WISHLIST ENDPOINTS:', ENDPOINTS?.WISHLIST);

export default { API_URL, ENDPOINTS };