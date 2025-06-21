import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt, FaEdit, FaCamera, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useTranslation } from 'react-i18next';

// Hàm để sửa URL avatar
const fixAvatarUrl = (url) => {
    if (!url) return 'https://ui-avatars.com/api/?name=User';
    
    try {
        // Loại bỏ timestamp nếu có
        const cleanUrl = url.split('?')[0];
        const timestamp = `?t=${new Date().getTime()}`;
        
        // Nếu URL chứa IP cụ thể, thay thế bằng localhost
        if (cleanUrl.includes('192.168.2.11')) {
            console.log('Fixing IP-based URL:', cleanUrl);
            return cleanUrl.replace('http://192.168.2.11:8080', 'http://localhost:8080') + timestamp;
        }
        
        // Nếu URL là đường dẫn tương đối, thêm localhost
        if (cleanUrl.startsWith('/')) {
            console.log('Fixing relative URL:', cleanUrl);
            return `http://localhost:8080${cleanUrl}${timestamp}`;
        }
        
        // Nếu URL đã là URL tuyệt đối, thêm timestamp để tránh cache
        if (cleanUrl.startsWith('http')) {
            console.log('Using absolute URL with timestamp:', cleanUrl);
            return `${cleanUrl}${timestamp}`;
        }
        
        // Trường hợp khác, trả về URL gốc với timestamp
        console.log('Using original URL with timestamp:', cleanUrl);
        return `${cleanUrl}${timestamp}`;
    } catch (error) {
        console.error('Error in fixAvatarUrl:', error);
        return 'https://ui-avatars.com/api/?name=User';
    }
};

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
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
    const { t } = useTranslation();

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
            if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                // Tự động logout và redirect
                logout().then(() => {
                    navigate('/login');
                });
            } else {
                setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
                toast.error('Không thể tải thông tin hồ sơ');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForceLogin = async () => {
        try {
            const success = await logout();
            if (success) {
                toast.info('Đã đăng xuất thành công');
                navigate('/login');
            } else {
                toast.error('Có lỗi xảy ra khi đăng xuất');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
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
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh hợp lệ');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 5MB');
            return;
        }
        setLoading(true);
        try {
            console.log('Profile - Uploading avatar file:', file.name);
            const response = await userService.uploadAvatar(file);
            if (response.code === 200) {
                // Update user context with new avatar URL
                // Check if it's a Cloudinary URL (starts with https) or local URL
                const avatarUrl = response.result.startsWith('http') 
                    ? response.result 
                    : `http://localhost:8080${response.result}`;
                updateUser({...user, avatar: avatarUrl});
                toast.success('Cập nhật ảnh đại diện thành công');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            toast.error(error.message || 'Không thể cập nhật ảnh đại diện');
        } finally {
            setLoading(false);
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
                            onClick={() => {
                                setError(null);
                                loadUserProfile();
                            }}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                        >
                            {t('profile.retry')}
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
                    {t('profile.title')}
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
                                                src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8080${user.avatar}`} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error('Avatar load error for URL:', e.target.src);
                                                    
                                                    // Ngăn chặn vòng lặp vô hạn bằng cách vô hiệu hóa xử lý lỗi
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name || 'User') + '&background=6366f1&color=ffffff';
                                                }}
                                                onLoad={(e) => {
                                                    console.log('Avatar loaded successfully:', e.target.src);
                                                }}
                                                key={user.avatar} // Thêm key để React biết khi nào cần re-render
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
                                    <div className="absolute -bottom-2 -right-2 text-xs text-gray-500 dark:text-gray-400">
                                        Nhấn để thay đổi
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="absolute -bottom-8 left-0 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    const response = await userService.checkUploads();
                                                    console.log('Upload directory contents:', response.result);
                                                    toast.info('Kiểm tra console để xem nội dung thư mục uploads');
                                                } catch (error) {
                                                    console.error('Error checking uploads:', error);
                                                    toast.error('Lỗi khi kiểm tra thư mục uploads');
                                                }
                                            }}
                                        >
                                            Kiểm tra uploads
                                        </button>
                                        <button 
                                            className="absolute -bottom-8 left-32 text-xs text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                try {
                                                    // Sửa URL avatar trực tiếp trong frontend
                                                    if (user && user.avatar) {
                                                        console.log('Current avatar URL:', user.avatar);
                                                        
                                                        // Loại bỏ timestamp nếu có
                                                        const cleanUrl = user.avatar.split('?')[0];
                                                        
                                                        // Kiểm tra xem URL có chứa IP cụ thể không
                                                        if (cleanUrl.includes('192.168.2.11')) {
                                                            // Tạo URL mới (đường dẫn tương đối)
                                                            const newAvatarUrl = cleanUrl.replace('http://192.168.2.11:8080', '');
                                                            console.log('New avatar URL (relative):', newAvatarUrl);
                                                            
                                                            // Cập nhật thông tin user trong context
                                                            const updatedUser = JSON.parse(JSON.stringify(user));
                                                            updatedUser.avatar = newAvatarUrl;
                                                            updateUser(updatedUser);
                                                            
                                                            toast.success('URL avatar đã được sửa thành công (đường dẫn tương đối)');
                                                            
                                                            // Tải lại trang sau 1 giây
                                                            setTimeout(() => {
                                                                window.location.reload();
                                                            }, 1000);
                                                            return;
                                                        }
                                                        
                                                        // Kiểm tra xem URL có phải là URL tuyệt đối không
                                                        if (cleanUrl.startsWith('http') && !cleanUrl.includes('localhost')) {
                                                            // Tạo URL mới (đường dẫn tương đối)
                                                            const urlObj = new URL(cleanUrl);
                                                            const path = urlObj.pathname;
                                                            console.log('New avatar URL (from absolute):', path);
                                                            
                                                            // Cập nhật thông tin user trong context
                                                            const updatedUser = JSON.parse(JSON.stringify(user));
                                                            updatedUser.avatar = path;
                                                            updateUser(updatedUser);
                                                            
                                                            toast.success('URL avatar đã được sửa thành công (từ URL tuyệt đối)');
                                                            
                                                            // Tải lại trang sau 1 giây
                                                            setTimeout(() => {
                                                                window.location.reload();
                                                            }, 1000);
                                                            return;
                                                        }
                                                        
                                                        toast.info('URL avatar không cần sửa');
                                                    } else {
                                                        toast.info('Không có avatar để sửa');
                                                    }
                                                } catch (error) {
                                                    console.error('Error fixing avatar URLs:', error);
                                                    toast.error('Lỗi khi sửa URL avatar: ' + error.message);
                                                }
                                            }}
                                        >
                                            Sửa URL avatar
                                        </button>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{formData.name}</h2>
                            </div>
                            
                            {/* Profile form */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('profile.personalInfo')}</h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <FaEdit />
                                        {isEditing ? t('profile.cancel') : t('profile.edit')}
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.fullname')}</label>
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
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.email')}</label>
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
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.phone')}</label>
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('profile.address')}</label>
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
                                    
                                    <div className="flex justify-end gap-4">
                                        {isEditing && (
                                            <button
                                                type="submit"
                                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                                            >
                                                {t('profile.save')}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowChangePasswordModal(true)}
                                            className="bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-gray-800 dark:text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                                        >
                                            <FaLock />
                                            {t('profile.changePassword')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
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