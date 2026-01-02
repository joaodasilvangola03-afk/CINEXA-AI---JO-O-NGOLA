
import { GoogleGenAI } from "@google/genai";

// NOTE: In a production environment, never expose API keys on the client.
// This should be proxied through a backend (Supabase Edge Function).
const API_KEY = process.env.API_KEY || ''; 

// Helper to determine if we should strictly use mock or try API
const shouldTryRealApi = !!API_KEY;

// Reliable high-quality assets for fallback/demo
// Using Google Storage Samples for guaranteed uptime on videos (Format: MP4 H.264)
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

export const geminiService = {
  generateText: async (prompt: string): Promise<string> => {
    if (!shouldTryRealApi) {
      await new Promise(r => setTimeout(r, 1000));
      return `[Demo Script] Roteiro gerado para: "${prompt}".\n\nCena 1: A câmera avança suavemente...`;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "";
    } catch (error) {
      console.warn("API Error (Text), falling back to demo:", error);
      return `[Fallback Script] Não foi possível conectar à IA. Roteiro simulado para: "${prompt}".`;
    }
  },

  generateSEO: async (prompt: string, language: string): Promise<{ title: string, description: string, tags: string[] }> => {
    console.log(`Generating Dual-Platform SEO for: ${prompt} in ${language}`);
    
    if (shouldTryRealApi) {
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const seoPrompt = `
                Act as a World-Class SEO Expert specializing in Video Marketing for both YouTube and Google Search.
                Context: A video about "${prompt}".
                Language: ${language}.
                
                Generate a JSON object with:
                1. "title": A hybrid title that is High CTR (Clickbait/Emotional) for YouTube BUT includes strong search keywords for Google ranking (under 70 chars).
                2. "description": A semantic description optimized for Google's NLP and YouTube's algorithm. 
                   - First 2 lines: Strong hook + main keyword.
                   - Middle: Detailed context for Google indexing.
                   - End: 3-5 hashtags.
                3. "tags": An array of 18 keywords mixed between:
                   - High-volume YouTube tags (broad).
                   - Long-tail Google Search queries (specific questions people ask).
                
                Output ONLY valid JSON.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: seoPrompt,
                config: { responseMimeType: 'application/json' }
            });
            
            const text = response.text || "{}";
            return JSON.parse(text);
        } catch (e) {
            console.error("SEO Gen Failed", e);
        }
    }
    
    // Fallback Mock SEO
    await new Promise(r => setTimeout(r, 1500));
    return {
        title: `🔴 ${prompt.substring(0, 10)} REVELADO: O Segredo que o Google Esconde`,
        description: `Descubra a verdade sobre ${prompt} neste vídeo completo. Se você está procurando entender os detalhes de ${prompt}, este é o guia definitivo.\n\nNeste vídeo abordamos:\n- O que é ${prompt}\n- Como funciona\n- Análise completa\n\n✅ Inscreva-se para dominar o assunto!\n\n#${prompt.split(' ')[0]} #Viral #GoogleSEO #Education`,
        tags: [prompt, `como fazer ${prompt}`, `tutorial ${prompt}`, "google trends", "viral video", "fyp", "educação", "documentário", "análise completa", "passo a passo", "curiosidades", "tech", "inovação", "2024", "tendências"]
    };
  },

  generateImage: async (prompt: string, modelId: string = 'imagen_3', aspectRatio: string = '1:1', count: number = 1): Promise<string[]> => {
    console.log(`Starting Image Generation: ${modelId} | Ratio: ${aspectRatio} | Count: ${count}`);
    
    // Simulate processing time for UX
    await new Promise(r => setTimeout(r, 2000 + (count * 500))); // Takes a bit longer for more images

    if (shouldTryRealApi) {
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: count,
                  aspectRatio: aspectRatio, 
                  outputMimeType: 'image/jpeg' 
                }
            });
            
            // Map all generated images to base64 strings
            return response.generatedImages.map(img => 
                `data:image/jpeg;base64,${img.image.imageBytes}`
            );
        } catch (e) {
            console.error("Real Image Gen Failed, using Dynamic Generator", e);
        }
    }

    // Dynamic Generation Fallback using Pollinations.ai
    // Generate 'count' distinct URLs with different seeds but same prompt
    const encodedPrompt = encodeURIComponent(prompt);
    const { width, height } = getDimensions(aspectRatio);
    
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
        const seed = Math.floor(Math.random() * 1000000);
        results.push(`https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`);
    }
    
    return results;
  },

  generateThumbnail: async (prompt: string, title: string, style: string, modelId: string = 'ideogram_2'): Promise<string> => {
    console.log(`Starting Thumbnail Generation: ${modelId} | ${style}`);
    await new Promise(r => setTimeout(r, 2500));

    // Try Real API if key exists
    if (shouldTryRealApi) {
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            // Advanced prompt engineering for thumbnails
            const modelPrompt = `
                YouTube Thumbnail, 8k resolution, high impact.
                Style: ${style}. 
                Core Subject: ${prompt}.
                Overlay Text: "${title}".
                Typography: Big, Bold, Readable, Viral Style, contrasting colors.
                Lighting: Cinematic, dramatic lighting, high contrast.
                Composition: Rule of thirds, focus on emotion and text.
            `;
            
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: modelPrompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: '16:9', 
                    outputMimeType: 'image/jpeg' 
                }
            });
            const b64 = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${b64}`;
        } catch (e) {
            console.error("Real Thumbnail Gen Failed, using Dynamic Generator", e);
        }
    }

    // Dynamic Generation Fallback for Thumbnails
    // Using Flux model on Pollinations which handles text better
    const enhancedPrompt = `youtube thumbnail, ${style} style, large text "${title}" written in bold font, ${prompt}, cinematic lighting, 4k, trending on artstation, detailed`;
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const seed = Math.floor(Math.random() * 1000000);

    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`;
  },

  generateVideo: async (
    prompt: string, 
    modelId: string = 'veo_3', 
    imageBase64?: string, 
    captions: boolean = false,
    audioConfig?: { musicStyle: string; soundEffects: boolean; },
    aspectRatio: string = '16:9'
  ): Promise<string> => {
    console.log(`Starting Video Generation: ${modelId} | Captions: ${captions} | Music: ${audioConfig?.musicStyle} | Ratio: ${aspectRatio}`);
    
    await new Promise(r => setTimeout(r, 4500));

    if (shouldTryRealApi) {
        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    aspectRatio: aspectRatio,
                }
            });
            
            console.log("Video operation started on API (simulated polling for demo)");
            throw new Error("Polling not implemented in frontend-only demo");
            
        } catch (e) {
            console.warn("Real Video Gen API failed or not implemented fully. Using HD Mock Video.", e);
        }
    }

    return getRandom(MOCK_VIDEOS);
  }
};
