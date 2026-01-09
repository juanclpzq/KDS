/**
 * Simple nanoid implementation
 * Generates a random alphanumeric ID
 */
export function nanoid(length: number = 12): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    id += alphabet[randomIndex];
  }

  return id;
}
