// This module handles one-time system initialization
export let hasInitialized = false;

export function initializeMessages() {
  const messages = [];
  
  // Add system message only if this is the first interaction
  if (!hasInitialized) {
    messages.push({
      role: "system",
      content: "You are a coding assistant",
    });
    hasInitialized = true; // Set the flag to true after first use
  }

  return messages; // Return the messages array (may contain system message or be empty)
}
