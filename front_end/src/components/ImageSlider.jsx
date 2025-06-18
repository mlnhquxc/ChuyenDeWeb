import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const images = [
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/mac-home.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/lap-home.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/RightBanner-ipad-b2s-2025.png',
];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Hàm chuyển đến slide trước đó
    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, []);

    // Hàm chuyển đến slide tiếp theo
    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, []);

    // Hàm chuyển đến slide cụ thể
    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    useEffect(() => {
        // Chỉ tự động chuyển slide khi không bị tạm dừng
        if (!isPaused) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);
            return () => clearInterval(interval);
        }
        return () => {};
    }, [isPaused, nextSlide]);

    return (
        <div 
            className="w-full h-[600px] relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-contain transition-all duration-700 ease-in-out"
            />
            
            {/* Nút chuyển slide trước */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full shadow-xl z-10 transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
            >
                <FiChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            {/* Nút chuyển slide tiếp theo */}
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full shadow-xl z-10 transition-all duration-300 hover:scale-110"
                aria-label="Next slide"
            >
                <FiChevronRight className="h-6 w-6 text-white" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-3 h-3 rounded-full ${currentIndex === idx ? 'bg-white' : 'bg-gray-400'} transition-all hover:scale-125 focus:outline-none`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;