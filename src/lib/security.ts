export async function hashPin(pin: string) {
  const encoder = new TextEncoder();
  const salt = "life-changer-book-local-pin";
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`${salt}:${pin}`));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function isValidPin(pin: string) {
  return /^\d{4,8}$/.test(pin);
}
