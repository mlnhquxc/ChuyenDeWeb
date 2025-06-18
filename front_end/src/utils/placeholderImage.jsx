// Utility for generating placeholder images
export const generatePlaceholderImage = (width = 64, height = 64, text = 'No Image') => {
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#F3F4F6"/>
        <rect x="${width * 0.25}" y="${height * 0.25}" width="${width * 0.5}" height="${height * 0.5}" stroke="#9CA3AF" stroke-width="2" fill="none"/>
        <circle cx="${width * 0.375}" cy="${height * 0.375}" r="${width * 0.05}" fill="#9CA3AF"/>
        <path d="M${width * 0.25} ${height * 0.625}L${width * 0.375} ${height * 0.5}L${width * 0.5} ${height * 0.625}L${width * 0.625} ${height * 0.5}V${height * 0.75}H${width * 0.25}V${height * 0.625}Z" fill="#9CA3AF"/>
        <text x="${width / 2}" y="${height * 0.9}" text-anchor="middle" fill="#9CA3AF" font-size="${width * 0.08}" font-family="Arial, sans-serif">${text}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };
  
  // Pre-generated common sizes
  export const PLACEHOLDER_IMAGES = {
    small: generatePlaceholderImage(64, 64),
    medium: generatePlaceholderImage(80, 80),
    large: generatePlaceholderImage(200, 200),
  };
  
  // React component for product image with fallback
  export const ProductImage = ({ 
    src, 
    alt, 
    className = '', 
    size = 'medium',
    onError,
    ...props 
  }) => {
    const handleError = (e) => {
      e.target.src = PLACEHOLDER_IMAGES[size] || PLACEHOLDER_IMAGES.medium;
      if (onError) onError(e);
    };
  
    return (
      <img
        src={src || PLACEHOLDER_IMAGES[size] || PLACEHOLDER_IMAGES.medium}
        alt={alt}
        className={`bg-gray-100 ${className}`}
        onError={handleError}
        {...props}
      />
    );
  };