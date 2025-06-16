import React, {useState, useEffect} from 'react';

import {FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt} from 'react-icons/fa';
import {toast} from 'react-toastify';
import userService from '../services/userService';
import authService from '../services/authService';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

const Profile = () => {
    const {user, updateUser} = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.getProfile();
            if (response.result) {
                setFormData({
                    name: response.result.fullname || '',
                    email: response.result.email || '',
                    phone: response.result.phone || '',
                    address: response.result.address || '',
                });
            }
        } catch (error) {
            console.error('Profile load error:', error);
            setError('Failed to load profile. Your session may have expired.');
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else {
                toast.error('Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForceLogin = () => {
        authService.logout();
        toast.info('Please login again');
        navigate('/auth');
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await userService.updateProfile({
                fullname: formData.name,
                phone: formData.phone,
                address: formData.address
            });

            if (response.result) {
                // Cập nhật lại thông tin user trong context
                updateUser({
                    ...user,
                    fullname: formData.name,
                    phone: formData.phone,
                    address: formData.address
                });
                toast.success('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await userService.uploadAvatar(file);
            if (response.success) {
                updateUser({...user, avatar: response.data.avatarUrl});
                toast.success('Avatar updated successfully');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update avatar');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-4">{error}</div>
                        <button
                            onClick={handleForceLogin}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                        >
                            <FaSignOutAlt />
                            Login Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;