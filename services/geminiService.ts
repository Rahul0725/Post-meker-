
import { GoogleGenAI } from "@google/genai";
import { PostInput } from "../types";

export const generateTelegramPost = async (inputs: PostInput): Promise<string> => {
  // Always use the required initialization pattern.
  // Note: For Vercel deployments, process.env.API_KEY must be provided.
  // If this is a client-side only app, ensure your build tool (like Vite/Webpack) 
  // is configured to define process.env.API_KEY.
  
  let apiKey: string;
  try {
    apiKey = process.env.API_KEY || "";
  } catch (e) {
    throw new Error("Environment 'process' is not defined. Ensure your build tool defines process.env.API_KEY.");
  }

  if (!apiKey) {
    throw new Error("API_KEY environment variable is empty or undefined.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const userPrompt = `
    Generate a Telegram post for these specific details:
    - Casino Type: ${inputs.casinoType}
    - Signup Bonus: ₹${inputs.signupBonus}
    - Wagering: ${inputs.wagering}
    - Min Withdrawal: ₹${inputs.minWithdrawal}
    - Casino Link: ${inputs.casinoLink}
    - Telegram Handle: ${inputs.telegramHandle}
    - Tone: ${inputs.tone}
    - Language: ${inputs.language}
  `;

  const systemInstruction = `
    You are a professional Telegram Casino Marketer specialized in the Indian market.
    Your identity/signature is @Its_Gods. 
    Generate a HIGH-CONVERTING, eye-catching Telegram post.

    STRICT RULES:
    1. Output must use Telegram-safe bold/italic formatting.
    2. Use heavy Unicode Bold characters for headings (e.g., 𝗡𝗘𝗪 𝗟𝗢𝗢𝗧, 𝗦𝗜𝗚𝗡𝗨𝗣 𝗕𝗢𝗡𝗨𝗦).
    3. Use plenty of casino/money emojis (🔥, 🎰, 💰, 🚀, 💎).
    4. Language: If Hinglish, use "Telegram Slang" (e.g., 'Bhai log loot lo', 'Direct withdrawal', 'Sabko milega').
    5. STRUCTURE (MANDATORY):
       - 💎 HEADLINE: Catchy & Bold
       - 🎁 BONUS: Clearly stated
       - ⚡ WITHDRAWAL: Fast & Minimum amount
       - 🔗 LINK: Provide the casino link prominently (exactly 2 times)
       - 🎯 CTA: Urgency (Limited Slots / Ending Soon)
       - ✅ VERIFICATION: Must include "100% Trusted & Verified by @Its_Gods"

    Output ONLY the post text. No introductory or concluding remarks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      }
    });

    if (!response.text) {
      throw new Error("AI returned an empty response.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Passing the specific error message up for easier debugging in Vercel
    throw new Error(error?.message || "Internal API Error");
  }
};
