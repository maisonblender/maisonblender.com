/**
 * ElevenLabs config & defaults.
 *
 * We lezen env-vars hier centraal zodat we op één plek kunnen detecteren
 * of ElevenLabs geconfigureerd is. Niet geconfigureerd = graceful fallback
 * naar Web Speech API (TTS) of knop verbergen (ConvAI).
 */

export const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

/**
 * Default voice = "Charlotte" (multilingual v2, warm en neutraal).
 * Te overschrijven via ELEVENLABS_VOICE_ID env-var.
 * Voice library: https://elevenlabs.io/app/voice-library
 */
export const DEFAULT_VOICE_ID = "XB0fDUnXU5powFXDhCwa";

/**
 * Flash v2.5 is 50% goedkoper dan multilingual v2 (0.5 vs 1 credit/char)
 * en heeft ~75ms lagere latency. Ondersteunt Nederlands + 32 talen. Voor
 * een conversational Ambassador is dit de sweet spot: goed genoeg in
 * kwaliteit, snappier response, houdt credits in toom.
 *
 * Overschrijf met ELEVENLABS_MODEL_ID=eleven_multilingual_v2 voor
 * maximale expressie (wel 2× zo duur per character).
 */
export const DEFAULT_MODEL_ID = "eleven_flash_v2_5";

export function getElevenLabsConfig() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  return {
    apiKey,
    voiceId,
    modelId,
    agentId,
    ttsEnabled: Boolean(apiKey),
    convaiEnabled: Boolean(apiKey && agentId),
  };
}
