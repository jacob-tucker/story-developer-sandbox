import { toHex, Hex } from "viem";

export async function getFileHash(file: File): Promise<Hex> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return toHex(new Uint8Array(hashBuffer), { size: 32 });
}
