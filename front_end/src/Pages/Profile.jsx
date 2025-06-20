import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt, FaEdit, FaCamera, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
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
            setError('Không thể tải thông tin hồ sơ. Phiên đăng nhập của bạn có thể đã hết hạn.');
            if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            } else {
                toast.error('Không thể tải thông tin hồ sơ');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForceLogin = () => {
        authService.logout();
        toast.info('Vui lòng đăng nhập lại');
        navigate('/auth');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                toast.success('Cập nhật hồ sơ thành công');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.message || 'Không thể cập nhật hồ sơ');
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
                toast.success('Cập nhật ảnh đại diện thành công');
            }
        } catch (error) {
            toast.error(error.message || 'Không thể cập nhật ảnh đại diện');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-200">
                    <div className="text-center">
                        <div className="text-red-500 dark:text-red-400 text-lg mb-6">{error}</div>
                        <button
                            onClick={handleForceLogin}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                        >
                            <FaSignOutAlt />
                            Đăng nhập lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 mb-8">
                    Thông tin tài khoản
                </h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-indigo-100 dark:border-indigo-900">
                                        {user?.avatar ? (
                                            <img 
                                                src={user.avatar} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name || 'User');
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-300">
                                                <FaUser size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md transition-colors">
                                        <FaCamera />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{formData.name}</h2>
                            </div>
                            
                            {/* Profile form */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Thông tin cá nhân</h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <FaEdit />
                                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ tên</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUser className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`pl-10 block w-full px-4 py-3 border ${!isEditing ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'} border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-colors duration-200`}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="pl-10 block w-full px-4 py-3 border bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-700 rounded-lg shadow-sm dark:text-white transition-colors duration-200"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaPhone className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`pl-10 block w-full px-4 py-3 border ${!isEditing ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'} border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-colors duration-200`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                            </div>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows="3"
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full px-4 py-3 border ${!isEditing ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'} border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-colors duration-200`}
                                            />
                                        </div>
                                    </div>
                                    
                                    {isEditing && (
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                                            >
                                                Lưu thay đổi
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setShowChangePasswordModal(true)}
                                className="flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            >
                                <FaLock className="mr-2" />
                                Đổi mật khẩu
                            </button>
                            
                            <button
                                onClick={handleForceLogin}
                                className="flex items-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Đăng xuất
                            </button>
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Tài khoản được tạo: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Change Password Modal */}
            <ChangePasswordModal 
                isOpen={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
            />
        </div>
    );
};

export default Profile;