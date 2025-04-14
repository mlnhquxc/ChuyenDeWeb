import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail ,FiChevronLeft, FiChevronRight} from "react-icons/fi";

const Footer = ()=> {
    return (
        <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">
                We provide fresh and organic products directly from farmers to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Shop</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Street, City, Country</li>
                <li>Phone: +1 234 567 8900</li>
                <li>Email: info@ogani.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l focus:outline-none text-gray-900 bg-white"
                />
                <button className="bg-green-500 px-4 py-2 rounded-r hover:bg-green-600">
                  <FiMail className="h-5 w-5" />
                </button>
              </div>
              <div className="flex space-x-4 mt-4">
                <FaFacebookF className="h-5 w-5 cursor-pointer hover:text-green-500" />
                <FaTwitter className="h-5 w-5 cursor-pointer hover:text-green-500" />
                <FaInstagram className="h-5 w-5 cursor-pointer hover:text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
}
export default Footer;