import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Mermaid } from '@/components/mermaid';
import { LLMCopyButton } from '@/components/page-actions';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    LLMCopyButton,
    ...components,
    img: (props) => {
      if (props.src?.startsWith('http')) {
        return <img {...props} />;
      }
      return <ImageZoom {...(props as any)} />;
    },
  };
}
