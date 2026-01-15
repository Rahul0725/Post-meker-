
import { GoogleGenAI } from "@google/genai";
import { PostInput } from "../types";

export const generateTelegramPost = async (inputs: PostInput): Promise<string> => {
  // Use process.env.API_KEY directly as per SDK requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a Telegram casino bonus post template expert for Indian users.
    Generate a HIGH-CONVERTING Telegram post based on these variables:
    
    - Casino Type: ${inputs.casinoType}
    - Signup Bonus: ₹${inputs.signupBonus}
    - Wagering: ${inputs.wagering}
    - Min Withdrawal: ₹${inputs.minWithdrawal}
    - Casino Link: ${inputs.casinoLink}
    - Telegram Handle: ${inputs.telegramHandle}
    - Tone: ${inputs.tone}
    - Language: ${inputs.language}

    STRICT RULES:
    1. Output must be 100% Telegram copy-paste safe.
    2. Use Telegram-supported bold Unicode characters (like 𝗙𝘂𝗹𝗹𝘆 𝗡𝗲𝘄, 𝗦𝗶𝗴𝗻𝘂𝗽, etc.) for impact.
    3. Language: ${inputs.language} (If Hinglish, use casual Indian Telegram style).
    4. Emojis must be hype-driven but clean.
    5. STRUCTURE (MANDATORY):
       - Bold catchy headline
       - Bonus & withdrawal details (bulleted with ⚡ or 🔥)
       - Repeated casino link (exactly 2 times)
       - Short explanation in ${inputs.language}
       - Trust/Verification line (e.g., 100% Verified ✅)
       - Urgency CTA (Today only / Limited slots)

    Output ONLY the final Telegram post. No meta-talk or explanations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "Failed to generate post. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error; // Re-throw to be caught by the App component
  }
};
