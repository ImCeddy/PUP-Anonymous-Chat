// Import the profanity lists from the external files
import enProfanityListRaw from '../../profanity-list-main/profanity-list-main/list/en.txt?raw';
import filProfanityListRaw from '../../profanity-list-main/profanity-list-main/list/fil.txt?raw';

// Process the raw text into arrays of prohibited words
const EN_PROHIBITED_WORDS = enProfanityListRaw
  .split('\n')
  .map(word => word.trim())
  .filter(word => word.length > 0);

const FIL_PROHIBITED_WORDS = filProfanityListRaw
  .split('\n')
  .map(word => word.trim())
  .filter(word => word.length > 0);

// Combine all prohibited words
const PROHIBITED_WORDS = [...EN_PROHIBITED_WORDS, ...FIL_PROHIBITED_WORDS];

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