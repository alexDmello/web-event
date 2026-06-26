import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;        // applied to outer container for layout/positioning/dimensions
  imgClassName?: string;     // applied to inner <img>
  containerClassName?: string;
  eager?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  aspectRatio?: string;
  /** Correct responsive sizes hint for the browser's resource picker. Prevents
   *  the browser defaulting to 100vw for every image, which causes it to fetch
   *  unnecessarily large files. Example: "(max-width: 768px) 100vw, 50vw" */
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  imgClassName = '',
  containerClassName = '',
  eager = false,
  objectFit = 'cover',
  containerStyle = {},
  style = {},
  aspectRatio,
  sizes
}) => {
  const [isInView, setIsInView] = useState(eager);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) {
      setIsInView(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    const currentContainer = containerRef.current;

    if (currentContainer && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (observer) {
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: '400px', // generous buffer zone to predictive load before entry
          threshold: 0.01
        }
      );

      observer.observe(currentContainer);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setIsInView(true);
    }

    return () => {
      if (observer && currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [eager]);

  const computedAspectRatio = aspectRatio !== undefined ? aspectRatio : (width && height ? `${width} / ${height}` : undefined);

  // Premium transition style for non-eager images
  const transitionStyle = eager
    ? {}
    : {
        transition: 'opacity 0.4s ease-in-out, filter 0.4s ease-in-out, transform 0.4s ease-in-out',
        willChange: 'opacity, filter, transform',
        opacity: isLoaded ? (style.opacity !== undefined ? style.opacity : 1) : 0,
        filter: isLoaded ? 'none' : 'blur(8px)',
        transform: isLoaded ? 'scale(1)' : 'scale(1.02)'
      };

  return (
    <div
      ref={containerRef}
      className={`optimized-image-container ${className} ${containerClassName}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: computedAspectRatio === 'unset' ? undefined : computedAspectRatio,
        backgroundColor: '#e5dfd5', // elegant luxury brand cream placeholder color
        overflow: 'hidden',
        ...containerStyle
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`optimized-img ${imgClassName} ${eager || isLoaded ? 'loaded' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            ...transitionStyle,
            ...style
          }}
        />
      )}
    </div>
  );
};
