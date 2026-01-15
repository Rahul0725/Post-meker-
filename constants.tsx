
import { PostInput } from './types';

export const DEFAULT_INPUTS: PostInput = {
  casinoType: 'New',
  signupBonus: '500',
  wagering: '1x',
  minWithdrawal: '100',
  casinoLink: 'https://example.com/play',
  telegramHandle: '@CasinoLootsIndia',
  tone: 'Hype',
  language: 'Hinglish',
};

export const CASINO_TYPES = ['New', 'Old', 'Verified', 'Loot'] as const;
export const TONES = ['Hype', 'Trust', 'Aggressive'] as const;
export const LANGUAGES = ['Hinglish', 'Hindi', 'English'] as const;
