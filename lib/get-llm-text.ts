import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remarkInclude } from 'fumadocs-mdx/config';
import { type Page } from '@/lib/source';
import { remarkNpm } from 'fumadocs-core/mdx-plugins';

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkAutoTypeTable)
  .use(remarkNpm);

export async function getLLMText(page: Page) {
  const category =
    {
      documentation: 'iChuck AI Chatbot Digital Procurement Documentation',
      example: 'iChuck AI Chatbot Examples and Templates',
    }[page.slugs[0]] ?? page.slugs[0];

  const processed = await processor.process({
    path: page.data._file.absolutePath,
    value: page.data.content,
  });

  return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://github.com/iChuck-W/chuck-aichatbot-digital-procurement-docs/blob/dev/content/docs/${page.path}

${page.data.description}
        
${processed.value}`;
}
