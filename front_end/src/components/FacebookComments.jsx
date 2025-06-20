import { useEffect, useRef, useState, useCallback } from "react";

const FacebookComments = ({ url, width = "100%", numPosts = 5 }) => {
  const commentsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [fbReady, setFbReady] = useState(false);

  // Hàm để tạo và render Facebook comments
  const renderComments = useCallback(() => {
    if (!commentsRef.current || !fbReady) return;

    try {
      // Xóa comments cũ
      const oldComments = commentsRef.current.querySelector('.fb-comments');
      if (oldComments) {
        oldComments.remove();
      }

      // Tạo element comments mới
      const commentsDiv = document.createElement('div');
      commentsDiv.className = 'fb-comments';
      commentsDiv.setAttribute('data-href', currentUrl);
      commentsDiv.setAttribute('data-width', width);
      commentsDiv.setAttribute('data-numposts', numPosts);
      commentsDiv.setAttribute('data-order-by', 'reverse_time');
      commentsDiv.setAttribute('data-colorscheme', 'light');

      commentsRef.current.appendChild(commentsDiv);

      // Parse Facebook comments
      if (window.FB && window.FB.XFBML) {
        console.log(`Parsing comments for URL: ${currentUrl}`);
        window.FB.XFBML.parse(commentsRef.current);
      } else {
        console.error("Attempted to render comments, but window.FB.XFBML is not available.");
      }
    } catch (err) {
      console.error("Error rendering Facebook comments:", err);
      setError("Có lỗi xảy ra khi tải bình luận Facebook.");
    }
  }, [currentUrl, width, numPosts, fbReady]);

  // Kiểm tra Facebook SDK
  useEffect(() => {
    const checkFacebookSDK = () => {
      if (window.FB) {
        setFbReady(true);
        setIsLoading(false);
        setError(null);
        return true;
      }
      return false;
    };

    // Kiểm tra ngay lập tức
    if (checkFacebookSDK()) {
      return;
    }

    // Nếu chưa sẵn sàng, đợi và thử lại
    let attempts = 0;
    const maxAttempts = 100; // 10 giây

    const interval = setInterval(() => {
      attempts++;
      console.log(`Checking for Facebook SDK... Attempt ${attempts}`);
      if (checkFacebookSDK()) {
        console.log("Facebook SDK found!");
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        console.error("Facebook SDK not found after multiple attempts.");
        setIsLoading(false);
        setError("Không thể tải Facebook SDK. Vui lòng kiểm tra kết nối internet.");
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Xử lý thay đổi URL
  useEffect(() => {
    if (currentUrl !== url) {
      setCurrentUrl(url);
      setIsLoading(true);
      setError(null);
    }
  }, [url, currentUrl]);

  // Render comments khi FB SDK sẵn sàng hoặc URL thay đổi
  useEffect(() => {
    if (fbReady && currentUrl) {
      // Delay nhỏ để đảm bảo DOM đã cập nhật
      const timer = setTimeout(() => {
        renderComments();
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [fbReady, currentUrl, renderComments]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (commentsRef.current) {
        const oldComments = commentsRef.current.querySelector('.fb-comments');
        if (oldComments) {
          oldComments.remove();
        }
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bình luận Facebook</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 tải bình luận...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bình luận Facebook</h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bình luận Facebook</h2>
      <div ref={commentsRef} className="min-h-[200px]">
        {/* Facebook comments sẽ được tạo động ở đây */}
      </div>
    </div>
  );
};

export default FacebookComments;