
export type CasinoType = 'New' | 'Old' | 'Verified' | 'Loot';
export type Tone = 'Hype' | 'Trust' | 'Aggressive';
export type Language = 'Hinglish' | 'Hindi' | 'English';

export interface PostInput {
  casinoType: CasinoType;
  signupBonus: string;
  wagering: string;
  minWithdrawal: string;
  casinoLink: string;
  telegramHandle: string;
  tone: Tone;
  language: Language;
}

export interface GeneratedPost {
  content: string;
  timestamp: number;
}
