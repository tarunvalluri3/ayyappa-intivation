/** Keep a number with the word that follows it ("1 November", "9:00 AM") so lines never break between them. */
export const bindNumbers = (s: string): string => s.replace(/(\d) (?=[A-Za-z])/g, '$1 ');
