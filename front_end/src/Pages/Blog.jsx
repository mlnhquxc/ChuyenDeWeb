import React from 'react';
import { FiCalendar, FiUser, FiTag, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu cho các bài viết blog
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Laptop Gaming Tốt Nhất Năm 2025',
      excerpt: 'Khám phá những mẫu laptop gaming mạnh mẽ nhất với hiệu năng vượt trội, đồ họa sống động và tản nhiệt hiệu quả cho trải nghiệm chơi game tuyệt vời.',
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: 'Minh Tuấn',
      date: '15/06/2025',
      category: 'Laptop',
      tags: ['Gaming', 'Laptop', 'Review']
    },
    {
      id: 2,
      title: 'So Sánh iPhone 17 Pro và Samsung Galaxy S26 Ultra',
      excerpt: 'Phân tích chi tiết về hiệu năng, camera, pin và các tính năng độc đáo giữa hai flagship hàng đầu từ Apple và Samsung trong năm 2025.',
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: 'Thanh Hà',
      date: '10/06/2025',
      category: 'Smartphone',
      tags: ['iPhone', 'Samsung', 'So sánh']
    },
    {
      id: 3,
      title: 'Cách Bảo Vệ Dữ Liệu Cá Nhân Trong Thời Đại Số',
      excerpt: 'Những mẹo và công cụ hữu ích giúp bảo vệ thông tin cá nhân, tài khoản trực tuyến và dữ liệu quan trọng khỏi các mối đe dọa an ninh mạng.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: 'Hoàng Nam',
      date: '05/06/2025',
      category: 'Bảo mật',
      tags: ['An ninh mạng', 'Bảo mật', 'Dữ liệu']
    },
    {
      id: 4,
      title: 'Tương Lai Của AI Trong Lĩnh Vực Công Nghệ',
      excerpt: 'Khám phá những xu hướng và ứng dụng mới nhất của trí tuệ nhân tạo đang định hình lại ngành công nghệ và cuộc sống hàng ngày của chúng ta.',
      image: 'https://images.unsplash.com/photo-1677442135136-760c813dce26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: 'Lan Anh',
      date: '01/06/2025',
      category: 'Công nghệ',
      tags: ['AI', 'Trí tuệ nhân tạo', 'Tương lai']
    },
    {
      id: 5,
      title: 'Hướng Dẫn Chọn Mua Tai Nghe True Wireless',
      excerpt: 'Những tiêu chí quan trọng cần cân nhắc khi lựa chọn tai nghe không dây, từ chất lượng âm thanh, thời lượng pin đến khả năng chống nước.',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: 'Quang Minh',
      date: '28/05/2025',
      category: 'Âm thanh',
      tags: ['Tai nghe', 'True Wireless', 'Hướng dẫn mua sắm']
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog Công Nghệ</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Cập nhật những tin tức, đánh giá và hướng dẫn mới nhất về công nghệ
            </p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
            Tất cả
          </button>
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Smartphone
          </button>
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Laptop
          </button>
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Công nghệ
          </button>
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Bảo mật
          </button>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center mr-4">
                    <FiCalendar className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <button 
                  className="flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  Đọc tiếp <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;