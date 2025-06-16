import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo context với giá trị mặc định để tránh lỗi undefined
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {}
});

export const ThemeProvider = ({ children }) => {
  // Kiểm tra localStorage hoặc sử dụng chế độ sáng làm mặc định
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    // Kiểm tra xem người dùng có thiết lập dark mode trong hệ thống không
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Nếu đã lưu trong localStorage thì sử dụng giá trị đó, nếu không thì kiểm tra thiết lập hệ thống
    return savedTheme !== null ? JSON.parse(savedTheme) : prefersDarkMode;
  });

  // Cập nhật class cho thẻ html khi chế độ thay đổi
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Lưu trạng thái vào localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Hàm để chuyển đổi giữa chế độ sáng và tối
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};