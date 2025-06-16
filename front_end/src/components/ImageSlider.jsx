import React, { useState, useEffect } from 'react';

const images = [
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/mac-home.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/lap-home.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/RightBanner-ipad-b2s-2025.png',
];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[600px] relative overflow-hidden">
            <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-contain transition-all duration-700 ease-in-out"
            />
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${currentIndex === idx ? 'bg-white' : 'bg-gray-400'} transition`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;