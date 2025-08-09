export function plainTextFromHtml(input: string): string {
    if (!input) return '';
    // normalize <br> variants to newlines
    const withBreaks = input.replace(/<\s*br\s*\/?>/gi, '\n');
    // strip remaining tags
    const stripped = withBreaks.replace(/<[^>]+>/g, '');
    // collapse excessive blank lines
    return stripped.replace(/\n{3,}/g, '\n\n').trim();
  }
  