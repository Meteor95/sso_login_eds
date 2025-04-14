import { Buffer } from "node:buffer";
import * as crypto from "node:crypto";
import { env } from "bun";

class RSACryptoHelper {
  // Fungsi untuk mengenkripsi token dengan kunci publik
  static async encryptToken(token: string): Promise<string> {
    try {
      const encrypted = crypto.publicEncrypt(
        env.RSA_PUBLIC_KEY || "", 
        new TextEncoder().encode(token)
        
      );
      return encrypted.toString('base64'); 
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  // Fungsi untuk mendekripsi token dengan kunci privat
  static async decryptToken(encryptedToken: string): Promise<string> {
    try {
      const decrypted = crypto.privateDecrypt(
        env.RSA_PRIVATE_KEY || "", 
        Buffer.from(encryptedToken, 'base64')
      );
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }
}

export default RSACryptoHelper;