import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

// Lấy ngôn ngữ đã lưu từ localStorage, mặc định là 'vi'
const savedLanguage = localStorage.getItem('language') || 'vi';
console.log('🌐 i18n: Khởi tạo với ngôn ngữ:', savedLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi }
    },
    lng: savedLanguage, // Sử dụng ngôn ngữ đã lưu
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
    
    // Debug options
    debug: false, // Đặt true nếu muốn debug
    
    react: {
      useSuspense: false // Tránh lỗi khi component chưa ready
    }
  });

// Lưu ngôn ngữ vào localStorage mỗi khi thay đổi
i18n.on('languageChanged', (lng) => {
  console.log('🌐 i18n: Ngôn ngữ thay đổi thành:', lng);
  localStorage.setItem('language', lng);
  
  // Force reload một số state để đảm bảo sync
  window.dispatchEvent(new Event('languageChanged'));
});

// Event để báo khi i18n đã sẵn sàng
i18n.on('initialized', () => {
  console.log('🌐 i18n: Đã khởi tạo thành công với ngôn ngữ:', i18n.language);
});

export default i18n; 