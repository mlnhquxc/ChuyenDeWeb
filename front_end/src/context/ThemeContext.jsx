import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo context với giá trị mặc định để tránh lỗi undefined
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {}
});

export const ThemeProvider = ({ children }) => {
  // Sử dụng chế độ sáng làm mặc định
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cập nhật class cho thẻ html khi chế độ thay đổi
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
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