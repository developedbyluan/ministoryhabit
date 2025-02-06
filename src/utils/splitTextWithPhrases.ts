export function filterMultiWordTexts(arrayOfTexts: string[]) {
  // Use filter to keep only elements with more than one word
  return arrayOfTexts.filter((text) => text.split(/\s+/).length > 1);
}

export function splitTextWithPhrases(text: string, phrases: string[]) {
  // Clean the text first - keep only letters, numbers, and apostrophes
  // Replace all other characters with spaces, then collapse multiple spaces
  const cleanText = text
    .replace(/[^a-zA-Z0-9'\s]/g, " ") // Replace non-alphanumeric (except apostrophe) with space
    .replace(/\s+/g, " ") // Collapse multiple spaces into one
    .trim(); // Remove leading/trailing spaces

  // Convert cleaned text to lowercase for case-insensitive matching
  const lowerText = cleanText.toLowerCase();

  // Clean and lowercase the phrases array for consistent matching
  const cleanedPhrases = phrases.map((phrase) =>
    phrase
      .replace(/[^a-zA-Z0-9'\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  );

  // Sort phrases by length (descending) to match longest phrases first
  const sortedPhrases = [...cleanedPhrases].sort((a, b) => b.length - a.length);

  // Initialize variables for processing
  const result = [];
  let currentPosition = 0;

  // Process the text until we reach the end
  while (currentPosition < cleanText.length) {
    let matchFound = false;

    // Check for phrase matches at current position
    for (const phrase of sortedPhrases) {
      if (lowerText.startsWith(phrase, currentPosition)) {
        // Get the actual case from cleaned text
        const actualPhrase = cleanText.slice(
          currentPosition,
          currentPosition + phrase.length
        );
        result.push(actualPhrase);
        currentPosition += phrase.length;
        // Skip any trailing whitespace
        while (cleanText[currentPosition] === " ") currentPosition++;
        matchFound = true;
        break;
      }
    }

    // If no phrase match, process as single word
    if (!matchFound) {
      // Find the next space or end of string
      let nextSpace = cleanText.indexOf(" ", currentPosition);
      if (nextSpace === -1) nextSpace = cleanText.length;

      // Add the word if it's not empty
      const word = cleanText.slice(currentPosition, nextSpace);
      if (word) result.push(word);

      // Move position past the word and any whitespace
      currentPosition = nextSpace;
      while (cleanText[currentPosition] === " ") currentPosition++;
    }
  }

  // Return result with all items converted to lowercase
  return result.map((item) => item.toLowerCase());
}