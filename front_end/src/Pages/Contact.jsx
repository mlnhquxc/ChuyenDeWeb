import React, { useState } from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactUs = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.email || !formData.message) {
            alert(t('contact.alertRequired'));
            return;
        }
        console.log('Form submitted:', formData);
        alert(t('contact.alertThankYou'));
        // Reset form
        setFormData({ email: '', name: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">{t('contact.title')}</h1>

                {/* Contact Form */}
                <div className="space-y-6 mb-16">
                    {/* Email and Name Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t('contact.email')} <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder={t('contact.emailPlaceholder')}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder={t('contact.namePlaceholder')}
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-4 py-3 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                            placeholder={t('contact.messagePlaceholder')}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        {t('contact.submit')}
                    </button>
                </div>

                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* About Club */}
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-700" />
                        </div>
                        <h3 className="font-semibold text-lg mb-3">{t('contact.aboutClub')}</h3>
                        <div className="text-sm text-gray-300 space-y-1">
                            <p>{t('contact.sellingUI')}</p>
                            <p>{t('contact.sellingUI')}</p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-8 h-8 text-gray-700" />
                        </div>
                        <h3 className="font-semibold text-lg mb-3">{t('contact.phoneTitle')}</h3>
                        <div className="text-sm text-gray-300">
                            <p>0123456789</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-gray-700" />
                        </div>
                        <h3 className="font-semibold text-lg mb-3">{t('contact.officeLocation')}</h3>
                        <div className="text-sm text-gray-300">
                            <p>HoChiMinh City</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;