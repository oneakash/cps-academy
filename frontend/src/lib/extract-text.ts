export function extractPlainText(richText: any[]): string {
  if (!Array.isArray(richText)) return '';
  return richText
    .map((node) => {
      if (node.type === 'paragraph' && node.children) {
        return node.children
          .filter((child: any) => child.type === 'text')
          .map((child: any) => child.text)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ')
    .trim();
}