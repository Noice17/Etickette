import { useEffect, useState } from "react";

interface BannerProps {
  user?: {
    username: string;
  } | null;
  title?: string;
  subtitle?: string;
  images?: string[];
  rotationInterval?: number; // in milliseconds
  height?: string;
  showIndicators?: boolean;
  overlayOpacity?: number; // 0-100
}

const defaultImages = [
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop&crop=center', // Tech/office
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop&crop=center', // Data visualization
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop&crop=center', // Charts/analytics
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=400&fit=crop&crop=center', // Modern office
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=400&fit=crop&crop=center'  // Business/tech
];

export default function Banner({
  user,
  title,
  subtitle,
  images = defaultImages,
  rotationInterval = 60000, // 1 minute default
  height = "h-48",
  showIndicators = true,
  overlayOpacity = 50
}: BannerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  // Background image rotation effect
  useEffect(() => {
    // Preload all images
    const preloadImages = () => {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
      setIsImagesLoaded(true);
    };

    preloadImages();

    // Set up interval to change background
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [images, rotationInterval]);

  const handleIndicatorClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Generate dynamic title
  const getTitle = () => {
    if (title) return title;
    if (user) return `Welcome ${user.username}!`;
    return "Welcome!";
  };

  return (
    <div className={`relative ${height} rounded-2xl overflow-hidden`}>
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: isImagesLoaded ? `url(${images[currentImageIndex]})` : 'none',
          backgroundColor: !isImagesLoaded ? '#475569' : 'transparent'
        }}
      >
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity / 100 }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center z-10">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
            {getTitle()}
          </h1>
          {subtitle && (
            <p className="text-lg text-white/90 drop-shadow-md">
              {subtitle}
            </p>
          )}
          
          {/* Image indicator dots */}
          {showIndicators && (
            <div className="flex justify-center space-x-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Switch to background ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
