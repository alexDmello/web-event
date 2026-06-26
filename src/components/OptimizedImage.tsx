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
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle the case where the image is already cached by the browser —
  // in that case `onLoad` never fires, so we check `complete` on mount.
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  const computedAspectRatio = aspectRatio !== undefined ? aspectRatio : (width && height ? `${width} / ${height}` : undefined);

  // Eager images are always immediately visible (no fade).
  // Lazy images fade in once the browser has decoded them.
  const imgStyle: React.CSSProperties = eager
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit,
        ...style
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit,
        // Start invisible, fade in smoothly once decoded — no jarring pop-in
        opacity: isLoaded ? (style.opacity !== undefined ? style.opacity : 1) : 0,
        transition: 'opacity 0.5s ease-in-out',
        willChange: 'opacity',
        ...style
      };

  return (
    <div
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
      {/*
       * The <img> is ALWAYS in the DOM — never conditionally removed.
       * We rely entirely on the browser's native loading="lazy" which:
       *   - uses a smarter algorithm than any JS IntersectionObserver
       *   - starts pre-fetching based on scroll velocity predictions
       *   - never evicts already-fetched images from its internal queue
       *   - works correctly across all scroll types (snap, smooth, touch)
       * Our JS only controls the CSS fade-in reveal (opacity), not the fetch.
       */}
      <img
        ref={imgRef}
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
        style={imgStyle}
      />
    </div>
  );
};
