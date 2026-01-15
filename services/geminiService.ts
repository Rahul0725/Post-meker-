
import { GoogleGenAI } from "@google/genai";
import { PostInput } from "../types";

export const generateTelegramPost = async (inputs: PostInput): Promise<string> => {
  // Use the API key directly from environment variables as per instructions.
  // The system handles its availability.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    Your identity/signature is @Its_Gods. Every post you create is verified by you.
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

    // Directly access .text property from the response
    return response.text || "Unexpected error: Empty response from AI.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return a more descriptive error message to help the user identify environment issues
    throw new Error(error?.message || "Internal API Error");
  }
};
