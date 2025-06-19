import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail ,FiChevronLeft, FiChevronRight} from "react-icons/fi";

const Footer = ()=> {
  return (
      <footer className="bg-gradient-to-r from-slate-800 to-gray-900 dark:from-gray-900 dark:to-black text-white py-12 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Về Chúng Tôi</h3>
              <p className="text-gray-400">
                Chúng tôi cung cấp các sản phẩm công nghệ chất lượng cao với giá cả hợp lý.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Liên Kết Nhanh</h3>
              <ul className="space-y-2">
                <li><Link to="/aboutUs" className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span> Về Chúng Tôi
                </Link></li>
                <li><Link to="/baoHanh" className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span> Bảo Hành
                </Link></li>
                <li><Link to="/doiTra" className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span> Chính sách đổi trả
                </Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span> FAQ
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Thông Tin Liên Hệ</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Đường Nguyễn Văn Linh, TP. Hồ Chí Minh
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Điện thoại: +84 123 456 789
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email: Nagis@gmail.com
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Bản Tin</h3>
              <div className="flex">
                <input
                    type="email"
                    placeholder="Email của bạn"
                    className="px-4 py-2 w-full rounded-l focus:outline-none text-gray-900 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-r hover:from-blue-600 hover:to-indigo-700 transition-colors duration-300">
                  <FiMail className="h-5 w-5" />
                </button>
              </div>
              <div className="flex space-x-4 mt-4">
                <FaFacebookF className="h-5 w-5 cursor-pointer hover:text-blue-400 transition-colors duration-300 transform hover:scale-110" />
                <FaTwitter className="h-5 w-5 cursor-pointer hover:text-sky-400 transition-colors duration-300 transform hover:scale-110" />
                <FaInstagram className="h-5 w-5 cursor-pointer hover:text-rose-400 transition-colors duration-300 transform hover:scale-110" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Nagis. Tất cả các quyền được bảo lưu.</p>
            <p className="mt-2 text-sm">Thiết kế bởi <span className="text-blue-300">Nhóm 5</span></p>
          </div>
        </div>
      </footer>
  )
}
export default Footer;