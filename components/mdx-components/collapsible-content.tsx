'use client';

import React, { useState, useEffect } from 'react';

interface CollapsibleContentProps {
  title?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  collapseText?: string;
  expandText?: string;
  inlineTitle?: React.ReactNode;
  showCount?: boolean;
  showDivider?: boolean;
}

export const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  title,
  children,
  defaultOpen = true,
  collapseText,
  expandText,
  inlineTitle,
  showCount = false,
  showDivider = true,
}) => {
  // Default to open
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  // Determine the text to display based on the open state
  const toggleText = isOpen ? collapseText : expandText;

  // Common button style
  const buttonStyle = {
    fontSize: '18px',
    display: 'flex' as const,
    alignItems: 'flex-start' as const,
    cursor: 'pointer' as const,
  };

  // Count links in children if showCount is true
  const countLinks = (element: React.ReactNode): number => {
    if (!element) return 0;

    if (Array.isArray(element)) {
      return element.reduce((count, child) => count + countLinks(child), 0);
    }

    if (React.isValidElement(element)) {
      if (element.type === 'a') {
        return 1;
      }

      const props = element.props as { children?: React.ReactNode };
      return countLinks(props.children);
    }

    return 0;
  };

  const linkCount = showCount ? countLinks(children) : 0;

  // Create inlineTitle from title if provided
  const effectiveInlineTitle =
    inlineTitle ||
    (title ? (
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {title}
        {showCount && linkCount > 0 ? ` (${linkCount})` : ''}
      </div>
    ) : null);

  // If inlineTitle or title is provided, use inline layout
  if (effectiveInlineTitle) {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <div style={{ flex: 1, paddingRight: '20px' }}>
            {effectiveInlineTitle}
          </div>
          <span
            style={{
              fontSize: '18px',
              cursor: 'pointer',
              minWidth: '20px',
              textAlign: 'center',
              flexShrink: 0,
            }}
            onClick={toggleContent}
          >
            {toggleText}
          </span>
        </div>

        {isOpen && children && (
          <div style={{ marginTop: '0px', paddingLeft: '10px' }}>
            {children}
          </div>
        )}

        {showDivider && (
          <hr
            style={{
              margin: '10px 0',
              border: 'none',
              borderTop: '1px solid #e0e0e0',
              opacity: 0.6,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{ ...buttonStyle, marginBottom: '8px' }}
        onClick={toggleContent}
      >
        <span>{toggleText}</span>
      </div>

      {isOpen && (
        <div>
          {children && <div style={{ marginTop: '5px' }}>{children}</div>}
        </div>
      )}

      {showDivider && (
        <hr
          style={{
            margin: '10px 0',
            border: 'none',
            borderTop: '1px solid #e0e0e0',
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
};
