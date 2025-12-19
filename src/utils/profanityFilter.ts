// List of prohibited words - expand as needed
const PROHIBITED_WORDS = [
  // Profanity
  'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'cock',
  'motherfucker', 'fucker', 'bullshit', 'crap', 'piss', 'dumbass', 'jackass',

  // Hate speech and slurs
  'nigger', 'nigga', 'faggot', 'fag', 'queer', 'homo', 'chink', 'gook', 'spic', 'wetback',
  'kike', 'heeb', 'raghead', 'towelhead', 'sandnigger', 'coon', 'porchmonkey',

  // Sexual content
  'sex', 'porn', 'naked', 'nude', 'tits', 'boobs', 'dick', 'cock', 'pussy', 'ass',
  'blowjob', 'handjob', 'cum', 'sperm', 'orgasm', 'masturbate', 'jerkoff',

  // Violence and threats
  'kill', 'murder', 'rape', 'beat', 'stab', 'shoot', 'bomb', 'terrorist', 'suicide',

  // Drugs
  'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'crack', 'ecstasy', 'lsd',

  // Other inappropriate content
  'pedophile', 'childporn', 'incest', 'bestiality', 'necrophilia'
];

// Create regex patterns for case-insensitive matching
const PROFANITY_PATTERNS = PROHIBITED_WORDS.map(word => {
  // Escape special regex characters and create case-insensitive pattern
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'gi');
});

/**
 * Censors prohibited words in a message by replacing them with asterisks
 * @param message - The message to censor
 * @returns The censored message
 */
export function censorMessage(message: string): string {
  if (!message || typeof message !== 'string') {
    return message;
  }

  let censoredMessage = message;

  // Replace each prohibited word with asterisks
  PROFANITY_PATTERNS.forEach(pattern => {
    censoredMessage = censoredMessage.replace(pattern, '*****');
  });

  return censoredMessage;
}

/**
 * Checks if a message contains prohibited words
 * @param message - The message to check
 * @returns True if the message contains prohibited words
 */
export function containsProhibitedWords(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }

  return PROFANITY_PATTERNS.some(pattern => pattern.test(message));
}