
import { GoogleGenAI, Type } from "@google/genai";
import { supabaseService } from "./supabaseService";
import { AI_PROVIDER_COSTS, MOCK_SFX } from "../constants";

// Reliable high-quality assets for fallback/demo
const MOCK_VIDEOS = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get dimensions based on aspect ratio string
const getDimensions = (ratio: string): { width: number, height: number } => {
    switch(ratio) {
        case '16:9': return { width: 1280, height: 720 };
        case '9:16': return { width: 720, height: 1280 };
        case '4:3': return { width: 1024, height: 768 };
        case '3:4': return { width: 768, height: 1024 };
        case '1:1': default: return { width: 1024, height: 1024 };
    }
};

// CINEXA Enterprise System Prompts
const CINEXA_SYSTEM_PROMPT = `
Você é o motor visual oficial da CINEXA AI.
Prioridade: Qualidade máxima, Nitidez extrema, Iluminação profissional.
Evite baixa resolução, ruídos, distorções e aparência amadora.
`;

const formatBasePrompt = (description: string) => `
[CINEXA AI – Geração Visual Premium]
Descrição da cena:
${description}
Evitar: baixa qualidade, pixelado, borrado, distorcido.
`;

const PRESETS: Record<string, string> = {
    "Cinematic": "Estilo cinematográfico, aparência de filme blockbuster, 4K, lentes anamórficas, profundidade de campo rasa, color grading profissional.",
    "Sci-Fi": "Ficção científica hard, ambiente futurista high-tech, naves espaciais detalhadas, superfícies metálicas reflexivas, hologramas, iluminação azul e laranja, estilo Interestelar, escala cósmica.",
    "Epic Fantasy": "Fantasia épica, escala grandiosa, medieval, castelos imponentes, magia visível, florestas encantadas, criaturas místicas, iluminação dourada e etérea, estilo Senhor dos Anéis.",
    "Psychological Horror": "Terror psicológico, atmosfera opressiva e perturbadora, iluminação fraca e contraste alto, sombras alongadas, distorções visuais sutis, paleta de cores fria e desaturada, estilo Silent Hill ou A24.",
    "Documentary": "Estilo documentário, câmera na mão (handheld), foco realista, granulação de filme sutil, iluminação natural não tratada, aparência de reportagem jornalística ou vida selvagem, estilo National Geographic/BBC.",
    "Photorealistic": "Hiper-realista, iluminação natural perfeita, texturas 8k, fotografia macro, Unreal Engine 5, raytracing.",
    "Anime": "Estilo anime japonês de alta qualidade, Studio Ghibli, cores vibrantes, traços detalhados, cel shading, cenários pintados à mão.",
    "3D Render": "Renderização 3D Octane, Redshift, iluminação volumétrica, materiais PBR, estilo Pixar ou Dreamworks.",
    "Minimalist": "Minimalista, limpo, cores sólidas, design abstrato, formas geométricas, Bauhaus, composição negativa.",
    "Cyberpunk": "Cyberpunk, neon, futurista, alta tecnologia, noite chuvosa, Blade Runner vibe, cromado e luzes de neon reflexivas.",
    "Watercolor": "Aquarela, artístico, suave, pintura manual, bordas difusas, cores pastéis, textura de papel.",
    "Noir": "Filme Noir, preto e branco, alto contraste, sombras duras, detetive, anos 40, dramático, fumaça e chuva.",
    "Vaporwave": "Vaporwave, retrô anos 80, glitch art, estátuas gregas, cores rosa e ciano neon, VHS tape effect.",
    "Stop Motion": "Animação Stop Motion, texturas de argila ou madeira, iluminação de estúdio, movimento quadro a quadro, estilo Laika Studios.",
    "Comic Book": "Estilo história em quadrinhos, linhas de tinta fortes, meio-tom (halftone), cores saturadas, ação dinâmica, estilo Marvel/DC."
};

// Enterprise Fallback Order (Python Logic Ported)
const AI_FALLBACK_ORDER = ["gemini", "openrouter", "openai", "stability"];

// --- CACHE LAYER (Simulating Redis) ---
// Simple hash function for client-side caching
const generateCacheKey = (prompt: string, type: string): string => {
    let hash = 0;
    const str = `${type}:${prompt}`;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `cinexa_cache_${hash}`;
};

const getCachedContent = (key: string): string | null => {
    const cached = sessionStorage.getItem(key);
    if (cached) {
        console.log(`[CINEXA CACHE] HIT: ${key}`);
        return cached;
    }
    console.log(`[CINEXA CACHE] MISS: ${key}`);
    return null;
};

const setCachedContent = (key: string, data: string) => {
    sessionStorage.setItem(key, data);
};

// --- CDN SIMULATION (Simulating S3) ---
// In a real app, this would upload binary data to AWS S3
const mockUploadToCDN = async (dataUrl: string): Promise<string> => {
    // Check if it's already a URL
    if (dataUrl.startsWith("http")) return dataUrl;
    
    // Simulating upload latency
    await new Promise(r => setTimeout(r, 500));
    // In this mock, we just return the Data URL as if it were a signed CDN URL, 
    // or we could return a placeholder if the string is too long for local storage logic.
    return dataUrl; 
};

// --- CREDIT LOGIC ---
const checkCredits = async (userId: string | undefined, provider: string): Promise<boolean> => {
    if (!userId) return true; // Bypass for anonymous/demo if architecture allows, or strictly enforce
    const user = await supabaseService.db.getUser(userId);
    if (!user) return false;
    
    const cost = AI_PROVIDER_COSTS[provider] || 1;
    if (user.isAdmin) return true;
    
    return user.credits >= cost;
};

const consumeCredits = async (userId: string | undefined, provider: string, mode: string) => {
    if (!userId) return;
    const user = await supabaseService.db.getUser(userId);
    if (!user || user.isAdmin) return;

    const cost = AI_PROVIDER_COSTS[provider] || 1;
    await supabaseService.db.updateUserCredits(userId, user.credits - cost);
    // Updated to match python DB schema logs(user_id, ai_used, mode, credits_left, timestamp)
    await supabaseService.db.logUsage(userId, provider, mode, cost);
};

// --- ORCHESTRATOR ---
async function executeOrchestrator<T>(
    userId: string | undefined,
    mode: string, // 'video', 'image', 'text'
    cacheKeyType: string,
    prompt: string,
    logic: (provider: string) => Promise<T>,
    fallbackValue?: T
): Promise<T> {
    
    // 1. Check Cache
    const cacheKey = generateCacheKey(prompt, cacheKeyType);
    const cached = getCachedContent(cacheKey);
    if (cached) return JSON.parse(cached) as T;

    // 2. Iterate Providers (Fallback Loop)
    for (const provider of AI_FALLBACK_ORDER) {
        try {
            // 3. Check Cost
            const canAfford = await checkCredits(userId, provider);
            if (!canAfford) {
                console.warn(`[CINEXA ENGINE] Skipping ${provider}: Insufficient credits.`);
                continue; 
            }

            console.log(`[CINEXA ENGINE] Attempting ${provider} for ${mode}...`);
            const result = await logic(provider);
            
            // 4. Success: Deduct Credits & Log
            await consumeCredits(userId, provider, mode);

            // 5. Cache Result
            setCachedContent(cacheKey, JSON.stringify(result));

            return result;

        } catch (e) {
            console.warn(`[CINEXA ENGINE] Provider ${provider} failed or not configured.`, e);
            continue; // Proceed to next provider
        }
    }

    if (fallbackValue !== undefined) {
        console.warn("[CINEXA ENGINE] All AIs failed. Using Ultimate Fallback.");
        return fallbackValue;
    }
    throw new Error("Todas as IAs falharam (Créditos insuficientes ou Erros de API).");
}

export const geminiService = {
  // Enterprise Feature: Prompt Enhancer
  enhancePrompt: async (prompt: string): Promise<string> => {
    return executeOrchestrator<string>(
        undefined, 
        'text',
        'text_enhance',
        prompt,
        async (provider) => {
            if (provider === 'gemini') {
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("No API Key");
                
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `Enhance this prompt for video/image generation, keeping it concise but descriptive. Maintain the original meaning but add visual details. User Prompt: "${prompt}"`,
                    config: {
                        systemInstruction: CINEXA_SYSTEM_PROMPT,
                    }
                });
                return response.text || prompt;
            }
            throw new Error("Provider not supported for enhancement");
        }, 
        prompt // Fallback is original prompt
    );
  },

  generateText: async (prompt: string): Promise<string> => {
    return executeOrchestrator<string>(
        undefined,
        'text',
        'text_gen',
        prompt,
        async (provider) => {
            if (provider === 'gemini') {
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("No API Key");

                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: prompt,
                    config: { systemInstruction: CINEXA_SYSTEM_PROMPT }
                });
                return response.text || "";
            }
            throw new Error("Implementation missing");
        }, 
        `[Demo Script] Roteiro gerado para: "${prompt}".`
    );
  },

  generateCaptions: async (videoDataUrl: string): Promise<string> => {
      const base64Data = videoDataUrl.split(',')[1] || videoDataUrl;
      const stored = localStorage.getItem('aivision_user');
      const userId = stored ? JSON.parse(stored).id : undefined;

      return executeOrchestrator<string>(
          userId,
          'text',
          'caption_gen',
          'cap_' + base64Data.substring(0, 50),
          async (provider) => {
              if (provider === 'gemini') {
                  const apiKey = process.env.API_KEY;
                  if (!apiKey) throw new Error("No API Key");
                  
                  const ai = new GoogleGenAI({ apiKey });
                  const response = await ai.models.generateContent({
                      model: 'gemini-2.5-flash-latest',
                      contents: {
                          parts: [
                              { inlineData: { mimeType: 'video/mp4', data: base64Data } },
                              { text: "Transcribe the audio of this video into WebVTT subtitle format. Output ONLY the raw WebVTT text." }
                          ]
                      }
                  });
                  return response.text || "";
              }
              throw new Error("Provider not supported");
          },
          "WEBVTT\n\n00:00.000 --> 00:05.000\n[Captions unavailable for demo]"
      );
  },

  generateSEO: async (prompt: string, language: string): Promise<{ title: string, description: string, tags: string[] }> => {
    const fallbackSEO = {
        title: `🔴 ${prompt.substring(0, 10)}... [VÍDEO IMPERDÍVEL]`,
        description: `Assista agora este vídeo incrível sobre ${prompt}. \n\n🔥 Inscreva-se no canal!\n#${prompt.split(' ')[0]} #Viral #YouTube`,
        tags: [prompt, "viral", "video", "youtube", "shorts"]
    };

    return executeOrchestrator(
        undefined, 
        'seo',
        'seo_gen', 
        prompt + language,
        async (provider) => {
            if (provider === 'gemini') {
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("No API Key");

                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `Generate POWERFUL SEO metadata for a video about: "${prompt}". Language: ${language}. Return JSON {title, description, tags[]}`,
                    config: { 
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["title", "description", "tags"]
                        }
                    }
                });
                return response.text ? JSON.parse(response.text) : fallbackSEO;
            }
            throw new Error("Provider not supported");
        }, 
        fallbackSEO
    );
  },

  generateImage: async (prompt: string, modelId: string = 'imagen_3', aspectRatio: string = '1:1', count: number = 1): Promise<string[]> => {
    console.log(`Starting Image Generation: ${modelId} | Ratio: ${aspectRatio} | Count: ${count}`);
    const stored = localStorage.getItem('aivision_user');
    const userId = stored ? JSON.parse(stored).id : undefined;

    return executeOrchestrator<string[]>(
        userId,
        'image',
        'image_gen',
        prompt + aspectRatio + count,
        async (provider) => {
            if (provider === 'gemini') {
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("No API Key");

                const enhanced = await geminiService.enhancePrompt(prompt);
                const finalPrompt = formatBasePrompt(enhanced);
                
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: finalPrompt,
                    config: {
                        numberOfImages: count,
                        aspectRatio: aspectRatio, 
                        outputMimeType: 'image/jpeg' 
                    }
                });
                
                return await Promise.all(response.generatedImages.map(img => 
                    mockUploadToCDN(`data:image/jpeg;base64,${img.image.imageBytes}`)
                ));
            }

            if (['openrouter', 'stability', 'openai'].includes(provider)) {
                console.log(`[CINEXA ENGINE] Using ${provider} via Proxy...`);
                const encodedPrompt = encodeURIComponent(prompt);
                const { width, height } = getDimensions(aspectRatio);
                const results: string[] = [];
                for (let i = 0; i < count; i++) {
                    const seed = Math.floor(Math.random() * 1000000);
                    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`;
                    results.push(await mockUploadToCDN(url));
                }
                return results;
            }
            throw new Error("Provider failed");
        }, 
        []
    );
  },

  generateThumbnail: async (
    prompt: string, 
    title: string, 
    style: string, 
    modelId: string = 'ideogram_2',
    burnText: boolean = false
  ): Promise<string> => {
    const stored = localStorage.getItem('aivision_user');
    const userId = stored ? JSON.parse(stored).id : undefined;

    return executeOrchestrator<string>(
        userId,
        'image',
        'thumb_gen',
        prompt + title + style + burnText,
        async (provider) => {
            // Enhanced Thumbnail Prompt Engineering
            let fullPrompt = `YouTube Thumbnail. Style: ${style}. Subject: ${prompt}.`;
            fullPrompt += ` Lighting: Cinematic, High Contrast, High Saturation.`;
            fullPrompt += ` Composition: Rule of thirds, clean layout, eye-catching.`;
            
            if (burnText) {
                fullPrompt += ` TEXT TO INCLUDE: "${title}". Ensure text is large, legible, and clear.`;
            } else {
                fullPrompt += ` IMPORTANT: Leave negative space on the image (top or bottom) for text overlay. Do NOT generate text inside the image. Clean background.`;
            }

            if (provider === 'gemini') {
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("No API Key");

                const ai = new GoogleGenAI({ apiKey });
                
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: fullPrompt,
                    config: {
                        numberOfImages: 1,
                        aspectRatio: '16:9', 
                        outputMimeType: 'image/jpeg'
                    }
                });
                const b64 = `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
                return await mockUploadToCDN(b64);
            }

            if (['openrouter', 'stability', 'openai'].includes(provider)) {
                // Pollinations Fallback
                const enhancedPrompt = encodeURIComponent(fullPrompt);
                const seed = Math.floor(Math.random() * 1000000);
                const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`;
                return await mockUploadToCDN(url);
            }

            throw new Error("Thumbnail provider failed");
        }
    );
  },

  generateVideo: async (
    prompt: string, 
    style: string,
    modelId: string = 'veo_3',
    language: string = 'English (US)', 
    voiceId: string = 'default', 
    imageBase64?: string, 
    captions: boolean = false,
    audioConfig?: { musicStyle: string; sfxId?: string | null; },
    aspectRatio: string = '16:9'
  ): Promise<{ url: string; captions?: string }> => {
    console.log(`Starting Video Generation with Orchestrator`);
    const stored = localStorage.getItem('aivision_user');
    const userId = stored ? JSON.parse(stored).id : undefined;

    let sfxDescription = "";
    if (audioConfig?.sfxId) {
        const sfx = MOCK_SFX.find(s => s.id === audioConfig.sfxId);
        if (sfx) sfxDescription = `Include Sound Effect: ${sfx.name} (${sfx.category})`;
    }
    const ultimateFallback = getRandom(MOCK_VIDEOS);

    const videoUrl = await executeOrchestrator<string>(
        userId,
        'video',
        'video_gen',
        prompt + style + modelId,
        async (provider) => {
            if (provider === 'gemini') {
                const apiKey = process.env.API_KEY;
                if (!apiKey) throw new Error("No API Key for Gemini");

                const enhanced = await geminiService.enhancePrompt(prompt);
                const styleDesc = PRESETS[style] || style;
                const fullPrompt = `
                    ${formatBasePrompt(enhanced)}
                    PARÂMETROS: Style Description: ${styleDesc}, Audio: ${audioConfig?.musicStyle}, ${sfxDescription}, Lang: ${language}
                `;

                console.log("Requesting Google Veo...");
                const ai = new GoogleGenAI({ apiKey });
                let operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: fullPrompt,
                    config: { aspectRatio: aspectRatio }
                });

                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    operation = await ai.operations.getVideosOperation({ operation: operation });
                }

                const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (!videoUri) throw new Error("Veo generation failed (No URI)");

                const response = await fetch(`${videoUri}&key=${apiKey}`);
                const blob = await response.blob();
                const mp4Blob = new Blob([blob], { type: 'video/mp4' });
                
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                         const base64data = reader.result as string;
                         const fixed = base64data.replace(/^data:[^;]*;/, 'data:video/mp4;');
                         resolve(fixed);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(mp4Blob);
                });
            }
            throw new Error(`Provider ${provider} not fully configured for Video yet.`);
        }, 
        ultimateFallback
    );

    let captionsText: string | undefined = undefined;
    if (captions && videoUrl && videoUrl.startsWith('data:')) {
        try {
            captionsText = await geminiService.generateCaptions(videoUrl);
        } catch (e) {
            console.error("Caption generation failed:", e);
        }
    }

    return { url: videoUrl, captions: captionsText };
  }
};
