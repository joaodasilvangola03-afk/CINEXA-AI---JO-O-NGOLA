

export enum PlanType {
  FREE = 'FREE',
  PLUS = 'PLUS',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  credits: number;
  isAdmin: boolean;
  isActive?: boolean;
  avatarUrl?: string;
}

export interface LogEntry {
  id: string;
  userId: string;
  aiUsed: string;
  mode: string;
  cost: number;
  creditsLeft: number;
  timestamp: string;
}

export interface AiUsageStats {
  [provider: string]: number;
}

export interface Generation {
  id: string;
  userId: string;
  type: 'VIDEO' | 'IMAGE' | 'THUMBNAIL';
  prompt: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  url?: string;
  thumbnailUrl?: string;
  createdAt: string;
  settings: {
    modelId?: string;
    duration?: number;
    aspectRatio?: string;
    style?: string;
    voiceId?: string;
    language?: string;
    captions?: boolean;
    seoEnabled?: boolean;
    audioConfig?: {
        musicStyle: string;
        sfxId?: string | null; // Changed from boolean to specific ID
    };
    textOverlay?: {
      title: string;
      subtitle: string;
      colorTheme: string;
    };
  };
  seo?: {
    title: string;
    description: string;
    tags: string[];
  };
  captionsText?: string;
}

export interface PlanDetails {
  id: PlanType;
  name: string;
  price: number;
  credits: number;
  features: string[];
  maxVideoDuration: number;
  hasWatermark: boolean;
}

export interface Voice {
  id: string;
  name: string;
  category: string;
  language: string;
  previewUrl: string;
  provider: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  category: 'Ação' | 'Ambiente' | 'Sci-Fi' | 'Terror' | 'UI' | 'Natureza';
  previewUrl: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  description: string;
  isPremium: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  detail: string;
  icon: string;
  isActive: boolean;
  bankName?: string;
  accountNumber?: string;
  beneficiary?: string;
}