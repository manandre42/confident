export const generateUsername = (): string => {
  const prefixes = ['brisa', 'vento', 'esfera', 'luz', 'eco', 'onda', 'aura', 'fluxo', 'mar', 'céu', 'zen', 'paz'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = Math.floor(Math.random() * 99) + 1;
  return `${randomPrefix}${randomNumber}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Simulated NLP check for PII (Personally Identifiable Information)
export const containsPII = (text: string): boolean => {
  // Regex for email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  
  // Regex for phone numbers (broad match)
  const phoneRegex = /(\(?\d{2}\)?\s?)?9?\d{4}[-.\s]?\d{4}/;

  // Regex for Name introduction patterns (e.g., "Meu nome é João", "Eu sou o Carlos")
  // Captures common Portuguese intros followed by a Capitalized word
  const nameIntroRegex = /(meu nome é|eu sou o|eu sou a|me chamo|sou o|sou a)\s+([A-Z][a-z]+)/i;
  
  // CPF basic check (3 digits dot 3 digits...)
  const cpfRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}/;

  return emailRegex.test(text) || phoneRegex.test(text) || nameIntroRegex.test(text) || cpfRegex.test(text);
};

export const censorText = (text: string): string => {
   // This is used if we want to display the text but mask specific parts.
   // For strict safety, if containsPII is true, we usually block the whole message or replace it entirely.
   if (containsPII(text)) {
     return "🔒 [Conteúdo oculto: dados pessoais identificados]";
   }
   return text;
};