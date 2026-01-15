
import { PostInput } from './types';

export const DEFAULT_INPUTS: PostInput = {
  casinoType: 'New',
  signupBonus: '',
  wagering: '',
  minWithdrawal: '',
  casinoLink: '',
  telegramHandle: '',
  tone: 'Hype',
  language: 'Hinglish',
};

export const CASINO_TYPES = ['New', 'Old', 'Verified', 'Loot'] as const;
export const TONES = ['Hype', 'Trust', 'Aggressive'] as const;
export const LANGUAGES = ['Hinglish', 'Hindi', 'English'] as const;
