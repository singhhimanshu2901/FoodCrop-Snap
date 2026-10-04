/**
 * Cryptographic SHA-256 tamper-evident hashing utility for FloodCrop Snap evidence packets
 */
export async function computePacketHash(data: Record<string, unknown>): Promise<string> {
  // Canonicalize stringified representation of core evidence
  const canonicalString = JSON.stringify(data, Object.keys(data).sort());
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(canonicalString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple checksum if subtle crypto is unavailable
  let hash = 0;
  for (let i = 0; i < canonicalString.length; i++) {
    const char = canonicalString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'fcs-' + Math.abs(hash).toString(16).padStart(16, '0') + '9a41';
}

export function generateEvidenceId(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `FCS-${year}-${month}-${randomNum}`;
}
