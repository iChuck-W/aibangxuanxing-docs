'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductFeatureProps {
  mediaItems: MediaItem[];
  children: React.ReactNode;
  maxVisibleItems?: number;
  collapseText?: string;
  expandText?: string;
  mediaAspectRatio?: string;
}

// Constants for media styles
const MEDIA_STYLES = {
  mainContainer: {
    position: 'relative' as const,
    width: '100%',
    marginBottom: '10px',
    overflow: 'hidden' as const,
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block' as const,
    margin: 0,
    padding: 0,
  },
  videoIframe: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
  },
  thumbnailContainer: {
    display: 'flex' as const,
    gap: '6px',
    flexWrap: 'wrap' as const,
    marginTop: '6px',
  },
  thumbnailItem: {
    height: '70px',
    position: 'relative' as const,
    cursor: 'pointer' as const,
    transition: 'opacity 0.2s ease',
    borderRadius: '5px',
    overflow: 'hidden' as const,
    boxSizing: 'border-box' as const,
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 0,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block' as const,
    borderRadius: '3px',
    margin: 0,
    padding: 0,
    flex: 1,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: '3px',
  },
  expandCollapseContainer: {
    marginTop: '-20px',
    position: 'relative',
    background:
      'linear-gradient(to bottom, transparent 0%, var(--color-fd-background, #f8f9fa) 30%, var(--color-fd-background, #f8f9fa) 70%)',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  expandCollapseButton: {
    background: 'none',
    border: 'none',
    color: '#0066cc',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px 0',
    textDecoration: 'none',
  },
} as const;

export const ProductFeature: React.FC<ProductFeatureProps> = ({
  mediaItems,
  children,
  maxVisibleItems = 6,
  collapseText = '▲ 收起阅读',
  expandText = '▼ 展开阅读',
  mediaAspectRatio = '3/2',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Check if content needs collapse functionality
  useEffect(() => {
    if (contentRef.current) {
      const listItems = contentRef.current.querySelectorAll('li');
      if (listItems.length > maxVisibleItems) {
        setNeedsCollapse(true);
        listItems.forEach((item, index) => {
          if (index >= maxVisibleItems) {
            (item as HTMLElement).style.display = isExpanded
              ? 'list-item'
              : 'none';
          }
        });
      }
    }
  }, [children, maxVisibleItems, isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * Renders the media carousel component
   * @returns JSX.Element or null if no media items
   */
  const renderMediaCarousel = () => {
    if (!mediaItems || mediaItems.length === 0) return null;

    const activeItem = mediaItems[activeMediaIndex];
    const maxThumbnails = 4;
    const thumbnailsToShow = mediaItems.slice(0, maxThumbnails);
    const thumbnailWidth = 90 / Math.min(thumbnailsToShow.length, 4);

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            ...MEDIA_STYLES.mainContainer,
            aspectRatio: mediaAspectRatio,
          }}
        >
          {activeItem.type === 'image' ? (
            <img
              src={activeItem.url}
              alt={activeItem.alt || ''}
              width={activeItem.width || 1500}
              height={activeItem.height || 1000}
              style={MEDIA_STYLES.mainImage}
              loading="lazy" // Added for performance optimization
            />
          ) : (
            <iframe
              src={activeItem.url}
              title={activeItem.alt || 'Video'}
              style={MEDIA_STYLES.videoIframe}
              allowFullScreen
              loading="lazy" // Added for performance optimization
            />
          )}
        </div>

        {mediaItems.length > 1 && (
          <div style={MEDIA_STYLES.thumbnailContainer}>
            {thumbnailsToShow.map((item, index) => (
              <div
                key={index}
                onClick={() => setActiveMediaIndex(index)}
                style={{
                  ...MEDIA_STYLES.thumbnailItem,
                  width: `${thumbnailWidth}%`,
                  opacity: index === activeMediaIndex ? 1 : 0.7,
                  border:
                    index === activeMediaIndex ? '2px solid #0070f3' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (index !== activeMediaIndex) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== activeMediaIndex) {
                    e.currentTarget.style.opacity = '0.7';
                  }
                }}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt || `Thumbnail ${index + 1}`}
                    width={item.width || 150}
                    height={item.height || 100}
                    style={MEDIA_STYLES.thumbnailImage}
                    loading="lazy" // Added for performance optimization
                  />
                ) : (
                  <div style={MEDIA_STYLES.videoThumbnail}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      {/* Left Media Carousel Section */}
      <div style={{ flex: '0 0 300px' }}>{renderMediaCarousel()}</div>

      {/* Right Content Section */}
      <div style={{ flex: 1, marginTop: 0 }}>
        <div className="product-features-content" ref={contentRef}>
          {children}
        </div>

        {/* Expand/Collapse Button */}
        {needsCollapse && (
          <div style={MEDIA_STYLES.expandCollapseContainer}>
            <button
              onClick={handleToggle}
              style={MEDIA_STYLES.expandCollapseButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
              aria-expanded={isExpanded}
            >
              {isExpanded ? collapseText : expandText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFeature;
