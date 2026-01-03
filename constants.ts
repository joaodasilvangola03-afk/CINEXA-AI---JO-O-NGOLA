
import { PlanType, PlanDetails, Voice, AIModel, SoundEffect } from './types';

export const APP_NAME = "CINEXA AI";

// Enterprise Cost Mapping
export const AI_PROVIDER_COSTS: Record<string, number> = {
    "gemini": 1,
    "stability": 2,
    "openrouter": 3,
    "openai": 4,
    "pollinations": 0 // Fallback/Free
};

export const PLANS: Record<PlanType, PlanDetails> = {
  [PlanType.FREE]: {
    id: PlanType.FREE,
    name: 'Free Starter',
    price: 0,
    credits: 10,
    features: ['Marca d\'água nos vídeos', '720p Qualidade', 'Suporte Básico', 'Acesso Limitado aos Modelos'],
    maxVideoDuration: 5,
    hasWatermark: true,
  },
  [PlanType.PLUS]: {
    id: PlanType.PLUS,
    name: 'Plus Creator',
    price: 29,
    credits: 130,
    features: [
        'Sem marca d\'água', 
        'Qualidade Full HD 1080p', 
        'Licença Comercial (Monetização)',
        'Vozes Neurais Ultra-Realistas', 
        'Ferramenta SEO Youtube',
        'Geração Prioritária (Fila Rápida)',
        'Histórico Estendido (1 Ano)'
    ],
    maxVideoDuration: 20,
    hasWatermark: false,
  },
  [PlanType.PREMIUM]: {
    id: PlanType.PREMIUM,
    name: 'Pro Studio',
    price: 99,
    credits: 1000,
    features: [
        'Qualidade Cinema 4K', 
        'Renderização Instantânea', 
        'Acesso à API para Devs', 
        'Vídeos de até 80min',
        'Clonagem de Voz (Seu Áudio)',
        'Acesso Antecipado (Modelos Beta)',
        'Licença White Label (Revenda)',
        'Gerente de Conta Dedicado'
    ],
    maxVideoDuration: 80,
    hasWatermark: false,
  }
};

export const VIDEO_MODELS: AIModel[] = [
  { id: 'veo_3', name: 'Veo', version: '3.1', provider: 'Google DeepMind', description: 'Equilibrado e rápido. Ótimo para vídeos longos.', isPremium: false },
  { id: 'sora_1', name: 'Sora', version: '1.0 Turbo', provider: 'OpenAI', description: 'Realismo cinematográfico extremo. Física complexa.', isPremium: true },
  { id: 'gen_3', name: 'Gen-3 Alpha', version: 'Alpha', provider: 'Runway', description: 'Controle criativo preciso e estilos artísticos.', isPremium: true },
  { id: 'kling_ai', name: 'Kling', version: '1.5', provider: 'Kuaishou', description: 'Alta resolução e movimento fluido de personagens.', isPremium: true },
  { id: 'luma_dream', name: 'Dream Machine', version: '1.0', provider: 'Luma AI', description: 'Excelente para transformações e morphing.', isPremium: false },
];

export const IMAGE_MODELS: AIModel[] = [
  { id: 'imagen_3', name: 'Imagen', version: '3.0', provider: 'Google DeepMind', description: 'Fotorealismo e tipografia precisa.', isPremium: false },
  { id: 'midjourney_v6', name: 'Midjourney', version: 'v6.1', provider: 'Midjourney', description: 'Estilo artístico inigualável e criatividade.', isPremium: true },
  { id: 'dalle_3', name: 'DALL-E', version: '3.0', provider: 'OpenAI', description: 'Fidelidade ao prompt e composición complexa.', isPremium: false },
  { id: 'flux_pro', name: 'Flux', version: '1.1 Pro', provider: 'Black Forest', description: 'A nova referência em detalhes e anatomia.', isPremium: true },
  { id: 'stable_3', name: 'Stable Diffusion', version: '3.5 Large', provider: 'Stability AI', description: 'Versatilidade e controle de estilo.', isPremium: false },
];

export const THUMBNAIL_MODELS: AIModel[] = [
  { id: 'ideogram_2', name: 'Ideogram', version: 'v2 Turbo', provider: 'Ideogram', description: 'O melhor do mundo para renderização de texto (Tipografia).', isPremium: false },
  { id: 'midjourney_v6', name: 'Midjourney', version: 'v6.1', provider: 'Midjourney', description: 'Estética "clickbait" vibrante e composición artística superior.', isPremium: true },
  { id: 'flux_1_pro', name: 'Flux', version: '1.1 Pro', provider: 'Black Forest', description: 'Realismo extremo e obediência total ao prompt.', isPremium: true },
  { id: 'dalle_3', name: 'DALL-E', version: '3.0', provider: 'OpenAI', description: 'Ótimo para seguir instruções complexas de layout.', isPremium: false },
  { id: 'imagen_3', name: 'Imagen', version: '3.0', provider: 'Google DeepMind', description: 'Rápido e eficiente para thumbnails simples.', isPremium: false },
];

// Using reliable Google Actions samples for better browser compatibility and uptime
const GOOGLE_AUDIO_BASE = "https://actions.google.com/sounds/v1";

const SAMPLE_VOICE_CHATTER_M = `${GOOGLE_AUDIO_BASE}/crowds/male_crowd_talking.ogg`; 
const SAMPLE_VOICE_CHATTER_F = `${GOOGLE_AUDIO_BASE}/crowds/female_crowd_talking.ogg`; 
const SAMPLE_SFX_EXPLOSION = `${GOOGLE_AUDIO_BASE}/explosions/medium_explosion.ogg`;
const SAMPLE_SFX_LASER = `${GOOGLE_AUDIO_BASE}/science_fiction/laser_gun_shot.ogg`;
const SAMPLE_SFX_RAIN = `${GOOGLE_AUDIO_BASE}/weather/rain_heavy_loud.ogg`;
const SAMPLE_SFX_BIRDS = `${GOOGLE_AUDIO_BASE}/animals/birds_singing.ogg`;
const SAMPLE_SFX_HORROR = `${GOOGLE_AUDIO_BASE}/horror/ghost_movement_b.ogg`;
const SAMPLE_SFX_UI = `${GOOGLE_AUDIO_BASE}/cartoon/pop.ogg`;
const SAMPLE_SFX_WHOOSH = `${GOOGLE_AUDIO_BASE}/foley/whoosh_fast.ogg`;
const SAMPLE_SFX_SPACE = `${GOOGLE_AUDIO_BASE}/science_fiction/humming_ship.ogg`;
const SAMPLE_SFX_WIND = `${GOOGLE_AUDIO_BASE}/weather/wind_blowing.ogg`;
const SAMPLE_SFX_GLITCH = `${GOOGLE_AUDIO_BASE}/science_fiction/steampunk_gadget_clicking.ogg`;

// Note: In a real app, these would point to signed URLs of the specific voice samples from ElevenLabs/OpenAI
export const MOCK_VOICES: Voice[] = [
  // ElevenLabs
  { id: 'eleven_turbo_adam', name: 'Adam', category: 'Conversational', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'eleven_turbo_rachel', name: 'Rachel', category: 'Narrative', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'eleven_turbo_eleven', name: 'Eleven', category: 'Dark/Deep', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'eleven_turbo_drew', name: 'Drew', category: 'News Anchor', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'eleven_turbo_clyde', name: 'Clyde', category: 'Deep', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'eleven_turbo_mimi', name: 'Mimi', category: 'Childish', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_F },
  
  // --- NEW VOICES (Expansion Pack) ---
  { id: 'eleven_dante', name: 'Dante', category: 'Cinematic/Trailer', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'eleven_freya', name: 'Freya', category: 'Soft Narration', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'openai_neon', name: 'Neon', category: 'Robotic/Sci-Fi', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'azure_francisca', name: 'Francisca', category: 'Warm/Brazilian', language: 'Português (BR)', provider: 'Azure AI', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'eleven_giovanni', name: 'Giovanni', category: 'Italian Accent', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'eleven_matilda', name: 'Matilda', category: 'Child/Storybook', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'playht_prof', name: 'The Professor', category: 'Deep/Educational', language: 'Multi-lingual', provider: 'Play.ht', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'google_news_pro', name: 'News Anchor', category: 'Fast/Formal', language: 'Multi-lingual', provider: 'Google Cloud', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'eleven_zeus', name: 'Zeus', category: 'God-like/Epic', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'openai_whisper', name: 'Whisper', category: 'ASMR/Calm', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_F },

  // OpenAI
  { id: 'openai_alloy', name: 'Alloy', category: 'Neutral', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'openai_echo', name: 'Echo', category: 'Warm', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'openai_fable', name: 'Fable', category: 'British', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'openai_onyx', name: 'Onyx', category: 'Deep/Man', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'openai_nova', name: 'Nova', category: 'Energetic', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'openai_shimmer', name: 'Shimmer', category: 'Clear', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_F },

  // Google Cloud
  { id: 'google_journey_f', name: 'Journey (F)', category: 'Storytelling', language: 'Multi-lingual', provider: 'Google Cloud', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'google_journey_m', name: 'Journey (M)', category: 'Storytelling', language: 'Multi-lingual', provider: 'Google Cloud', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'google_studio_f', name: 'Studio Voice A', category: 'Professional', language: 'Multi-lingual', provider: 'Google Cloud', previewUrl: SAMPLE_VOICE_CHATTER_F },
  
  // Azure AI
  { id: 'azure_ava', name: 'Ava', category: 'Professional', language: 'Multi-lingual', provider: 'Azure AI', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'azure_andrew', name: 'Andrew', category: 'Warm', language: 'Multi-lingual', provider: 'Azure AI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'azure_brian', name: 'Brian', category: 'Documentary', language: 'Multi-lingual', provider: 'Azure AI', previewUrl: SAMPLE_VOICE_CHATTER_M },

  // Play.ht
  { id: 'playht_william', name: 'William', category: 'Advertising', language: 'Multi-lingual', provider: 'Play.ht', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'playht_sophia', name: 'Sophia', category: 'Soft', language: 'Multi-lingual', provider: 'Play.ht', previewUrl: SAMPLE_VOICE_CHATTER_F },

  // Native Specific (Legacy/Standard)
  { id: 'pt_native_1', name: 'António', category: 'Narrative', language: 'Português', provider: 'Azure AI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'pt_native_2', name: 'Vitória', category: 'Soft', language: 'Português', provider: 'Azure AI', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'pt_br_native_1', name: 'Brenda', category: 'Commercial', language: 'Português (BR)', provider: 'Google Cloud', previewUrl: SAMPLE_VOICE_CHATTER_F },
  { id: 'pt_br_native_2', name: 'Donato', category: 'Deep', language: 'Português (BR)', provider: 'ElevenLabs', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'es_native_1', name: 'Sergio', category: 'Warm', language: 'Spanish', provider: 'OpenAI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'fr_native_1', name: 'Benoit', category: 'Formal', language: 'French', provider: 'Google Cloud', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'de_native_1', name: 'Gunther', category: 'Authoritative', language: 'German', provider: 'Azure AI', previewUrl: SAMPLE_VOICE_CHATTER_M },
  { id: 'jp_native_1', name: 'Kyoko', category: 'Anime', language: 'Japanese', provider: 'Play.ht', previewUrl: SAMPLE_VOICE_CHATTER_F },
];

export const MOCK_SFX: SoundEffect[] = [
    { id: 'sfx_explosion_1', name: 'Cinematic Explosion', category: 'Ação', previewUrl: SAMPLE_SFX_EXPLOSION },
    { id: 'sfx_laser_shoot', name: 'Laser Blaster', category: 'Sci-Fi', previewUrl: SAMPLE_SFX_LASER },
    { id: 'sfx_rain_city', name: 'Rainy City', category: 'Ambiente', previewUrl: SAMPLE_SFX_RAIN },
    { id: 'sfx_forest_day', name: 'Forest Birds', category: 'Natureza', previewUrl: SAMPLE_SFX_BIRDS },
    { id: 'sfx_horror_drone', name: 'Dark Drone', category: 'Terror', previewUrl: SAMPLE_SFX_HORROR },
    { id: 'sfx_ui_click', name: 'Modern UI Click', category: 'UI', previewUrl: SAMPLE_SFX_UI },
    { id: 'sfx_whoosh', name: 'Fast Whoosh', category: 'Ação', previewUrl: SAMPLE_SFX_WHOOSH },
    { id: 'sfx_space_hum', name: 'Spaceship Hum', category: 'Sci-Fi', previewUrl: SAMPLE_SFX_SPACE },
    { id: 'sfx_wind_howl', name: 'Wind Howling', category: 'Natureza', previewUrl: SAMPLE_SFX_WIND },
    { id: 'sfx_glitch', name: 'Digital Glitch', category: 'Sci-Fi', previewUrl: SAMPLE_SFX_GLITCH },
];

export const VIDEO_STYLES = [
  'Cinematic', 
  'Sci-Fi', 
  'Epic Fantasy', 
  'Psychological Horror', 
  'Documentary', 
  'Anime', 
  'Photorealistic', 
  '3D Render', 
  'Cyberpunk', 
  'Stop Motion', 
  'Comic Book', 
  'Minimalist', 
  'Watercolor', 
  'Noir', 
  'Vaporwave'
];

export const MUSIC_STYLES = [
    'Cinematic / Epic', 
    'Lo-Fi / Chill', 
    'Cyberpunk / Synthwave', 
    'Corporate / Upbeat', 
    'Horror / Suspense', 
    'Nature / Ambient',
    'Jazz / Lounge',
    'Rock / High Energy',
    'None / Silence'
];

export const LANGUAGES = [
  'Português (PT)', 'Português (BR)', 'English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Mandarin', 'Hindi', 'Arabic'
];

export const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9', desc: 'Youtube / TV' },
  { id: '9:16', label: '9:16', desc: 'TikTok / Reels' },
  { id: '1:1', label: '1:1', desc: 'Square / Feed' },
  { id: '4:3', label: '4:3', desc: 'Classic' },
  { id: '3:4', label: '3:4', desc: 'Portrait' }
];
