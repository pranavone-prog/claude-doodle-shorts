# Sound (measured)

Tools:
- Transcripts: `node templates/remotion/scripts/transcribe.mjs <reel> <out.json>` (whisper.cpp medium.en, word timings).
- Loudness: `ffmpeg -af ebur128` / `volumedetect`.

| Reel | What whisper hears | mean dB | integrated |
|---|---|---|---|
| 01 | growling, panting, groans, screaming, explosions | −17.2 | −14.1 LUFS |
| 02 | music only | −14.6 | −14.0 LUFS |
| 03 | music only | −15.5 | −14.1 LUFS |
| 04 | music only | −15.3 | −14.1 LUFS |
| 05 | a short skit dialogue + one sponsor line | −15.9 | −14.1 LUFS |
| 06 | laughing, music, explosion, screaming, snort, sniff | −18.1 | −14.1 LUFS |
| 07 | music, thunder, gibberish "Spanish", screaming + one sponsor line | −16.9 | |
| 08 | music, three shouted meme lines + one sponsor line | −15.7 | |
| 09 | a sung hook | −16.2 | |
| 10 | panting, squeaks, snoring, "Huh?", explosion, screaming + one sponsor line | −15.9 | |
| 11 | gibberish, elevator music, "Hello!" ×4, explosion | −16.5 | |
| 12 | music only | −16.0 | |

## Rules
- **No narrator.** Music, cartoon SFX and non-verbal voice carry the reel: grunts, screams, laughs, gibberish.
- **The twist:** the music cuts dead (a scratch, then silence) for the sting.
- **Sponsor (optional):** one line in a normal voice at the very end, over the app insert.
- **Loudness: exactly −14 LUFS integrated.** Instagram normalises to this. `scripts/render.mjs` applies
  `loudnorm=I=-14:TP=-1` in its finish pass.
- **Ours:** `scripts/sfx.mjs` synthesizes 13 SFX and an original 100 BPM loop. Record your own grunts and laughs as
  `public/sfx/<name>.wav` (same names) to replace the synthetic ones. Real voices are funnier.
