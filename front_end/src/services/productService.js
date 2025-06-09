import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const productService = {
    getAllProducts: async (page = 0, size = 10, sortBy = 'id') => {
        try {
            const response = await axios.get(`${API_URL}/products`, {
                params: { page, size, sortBy }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    getAllProducts2: async (page = 0, size = 10, sortBy = 'id', category = "") => {
        try {
            let url = `${API_URL}/products`;
            
            // Nếu có category, sử dụng endpoint category
            if (category) {
                url = `${API_URL}/products/category/${category}`;
            }
            
            const response = await axios.get(url, {
                params: { 
                    page, 
                    size, 
                    sortBy
                }
            });
            
            if (!response.data) {
                throw new Error('No data received from server');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error.response?.data || error.message);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    getProductDetailById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/products/${id}/detail`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product detail:', error);
            throw error;
        }
    },

    getProductsByCategory: async (categoryName, page = 0, size = 10, sortBy = 'id') => {
        try {
            const response = await axios.get(`${API_URL}/products/category/${categoryName}`, {
                params: { page, size, sortBy }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    searchProducts: async (keyword, page = 0, size = 10, sortBy = 'id') => {
        try {
            const response = await axios.get(`${API_URL}/products/search`, {
                params: { keyword, page, size, sortBy }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }
}; 