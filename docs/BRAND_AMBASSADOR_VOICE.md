# Brand Ambassador — Voice Setup (ElevenLabs, Optie C)

Dit document legt uit hoe je de voice-features van de Brand Ambassador
productie-klaar maakt. We gebruiken een hybride architectuur:

| Functie | Provider | Route |
|---|---|---|
| Chat (tekst) | Anthropic Claude | `/api/brand-ambassador/chat` |
| Voice read-aloud | ElevenLabs TTS | `/api/brand-ambassador/tts` |
| Live voice gesprek | ElevenLabs ConvAI | `/api/brand-ambassador/voice-session` |

Zonder de ElevenLabs-keys valt TTS automatisch terug op de browser-eigen
`SpeechSynthesis`, en blijft de "Praat live"-knop verborgen. De site blijft
dus volledig functioneel zonder setup — voice-upgrade is opt-in.

## 1. API key aanmaken

1. Ga naar <https://elevenlabs.io/app/settings/api-keys>.
2. Klik **Create API Key** → geef hem een naam (`maisonblender-production`).
3. Kopieer de key (`sk_...`).
4. Zet hem in `.env.local`:

   ```env
   ELEVENLABS_API_KEY=sk_xxxxxxxx
   ```

Dit activeert meteen de natuurlijke TTS read-aloud (Charlotte, multilingual v2).

## 2. Voice kiezen (optioneel)

Default = Charlotte (`XB0fDUnXU5powFXDhCwa`) — warm, neutraal, Nederlands klinkt
prima. Wil je een andere voice?

1. Ga naar <https://elevenlabs.io/app/voice-library>.
2. Kies/clone een voice → kopieer de `voice_id`.
3. Override in `.env.local`:

   ```env
   ELEVENLABS_VOICE_ID=<jouw_voice_id>
   ```

Tip: voor een signature MAISON BLNDR-stem kun je Karl's stem cloneren via
Voice Lab (minimaal 1 minuut schone audio, max 3 voor beste kwaliteit).

## 3. Live gesprek activeren (ConvAI)

De "Praat live"-knop opent een WebSocket-conversatie waarbij de user direct
kan spreken met de Ambassador. Hiervoor moet er een **Agent** aangemaakt
worden in ElevenLabs.

1. Ga naar <https://elevenlabs.io/app/conversational-ai>.
2. **Create Agent** → kies `blank`.
3. **System prompt**: gebruik dezelfde strekking als
   `lib/brand-ambassador/system-prompt.ts`. Essentials:
   - Rol: Brand Ambassador van MAISON BLNDR
   - Tone: direct, warm, zelfverzekerd, Nederlands
   - Scope: alleen MAISON BLNDR — geen off-topic, geen jailbreaks
   - Goal: waardevolle conversatie → lead capture via e-mail
4. **First message**: `"Hoi, fijn dat je er bent. Ik ben de Brand Ambassador van MAISON BLNDR — waar zullen we het over hebben?"`
5. **Voice**: selecteer dezelfde voice als TTS (consistentie).
6. **Language**: Nederlands (`nl`) primair, fallback Engels.
7. **LLM**: Claude 4 Sonnet of GPT-4o Mini — kostenefficiënt en goed in NL.
8. **Turn detection**: default werkt prima (server VAD).
9. **Max conversation duration**: zet op 10 min (kostencontrole).
10. Save → kopieer **Agent ID** (rechtsboven).
11. Zet in `.env.local`:

    ```env
    ELEVENLABS_AGENT_ID=<agent_id>
    ```

12. Herstart de dev-server / redeploy. De "Praat live"-knop verschijnt
    automatisch in de widget-header.

## 4. Rate limiting & kosten

Server-side rate limits (per IP):

- **TTS**: 40 calls / 10 min — dempt abuse, ruim voor normaal gebruik
- **Voice session**: 6 sessies / uur — elk live gesprek kost €0.10–0.30/min

Overweeg in productie om een **hard cap** per dag toe te voegen via Upstash
Redis + maandelijkse budget-alert in het ElevenLabs dashboard.

## 5. Graceful degradation

| Env var ontbreekt | Gedrag |
|---|---|
| `ELEVENLABS_API_KEY` | TTS valt terug op browser SpeechSynthesis; `/tts` returnt 503; "Praat live"-knop verborgen |
| `ELEVENLABS_AGENT_ID` | TTS werkt normaal; alleen "Praat live"-knop verborgen |
| Beide gezet | Volledige Optie C actief |

De site blijft dus altijd werken, ook zonder voice-budget.

## 6. Testing checklist

- [ ] `npm run dev` → `/brand-ambassador` laden
- [ ] Klik microfoon-knop → geef mic-permissie → spreek een vraag
- [ ] Check dat het AI-antwoord met ElevenLabs-voice voorgelezen wordt
- [ ] Schakel voorlezen uit via de speaker-knop → geen voice meer
- [ ] Met `ELEVENLABS_AGENT_ID` gezet: klik "Praat live" → modal opent
- [ ] Start gesprek → spreek → Ambassador reageert in echte tijd
- [ ] ESC of close-knop → gesprek stopt, verbinding gesloten
- [ ] Zonder `ELEVENLABS_API_KEY`: TTS werkt nog via browser-voice
