#!/usr/bin/env node
// =============================================================================
// generate-sounds.js
// Generates placeholder WAV files for all sound effects and BGM tracks.
// Run with: node scripts/generate-sounds.js
//
// WAV format: 44-byte RIFF/PCM header + raw 16-bit mono PCM at 44100 Hz.
// Each sound is a simple sine wave at a distinctive frequency/duration.
// =============================================================================

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Sound definitions: [filename, frequencyHz, durationMs]
// ---------------------------------------------------------------------------

const SOUNDS = [
  // Sound Effects (SE01-SE14)
  ['SE01_pick_up.wav',       800,  100],
  ['SE02_hover_tick.wav',   1200,   50],
  ['SE03_snap_place.wav',    600,  150],
  ['SE04_invalid_drop.wav',  300,  200],
  ['SE05_line_clear.wav',   1000,  300],
  ['SE06_combo_2.wav',      1200,  300],
  ['SE07_combo_3.wav',      1500,  400],
  ['SE08_chain_up.wav',      900,  200],
  ['SE09_score_pop.wav',    1100,  100],
  ['SE10_level_clear.wav',   800, 1000],
  ['SE11_game_over.wav',     200, 1500],
  ['SE12_star_appear.wav',  1400,  150],
  ['SE13_button_tap.wav',   1000,   80],
  ['SE14_booster_use.wav',   700,  250],

  // Background Music (BGM01-BGM04) - longer, lower frequencies
  ['BGM01_classic.wav',      220, 3000],
  ['BGM02_level.wav',        330, 3000],
  ['BGM03_daily.wav',        262, 3000],
  ['BGM04_menu.wav',         196, 3000],
];

// ---------------------------------------------------------------------------
// WAV file generator
// ---------------------------------------------------------------------------

const SAMPLE_RATE = 44100;
const BITS_PER_SAMPLE = 16;
const NUM_CHANNELS = 1;

/**
 * Generate a minimal WAV file buffer containing a sine wave.
 * @param {number} frequency - Tone frequency in Hz
 * @param {number} durationMs - Duration in milliseconds
 * @returns {Buffer}
 */
function generateWav(frequency, durationMs) {
  const numSamples = Math.floor(SAMPLE_RATE * (durationMs / 1000));
  const dataSize = numSamples * NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  const fileSize = 44 + dataSize; // 44-byte header + data

  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  // ---- RIFF header ----
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset); offset += 4; // ChunkSize
  buffer.write('WAVE', offset); offset += 4;

  // ---- fmt sub-chunk ----
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;            // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, offset); offset += 2;             // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(NUM_CHANNELS, offset); offset += 2;  // NumChannels
  buffer.writeUInt32LE(SAMPLE_RATE, offset); offset += 4;   // SampleRate
  const byteRate = SAMPLE_RATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  buffer.writeUInt32LE(byteRate, offset); offset += 4;      // ByteRate
  const blockAlign = NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;    // BlockAlign
  buffer.writeUInt16LE(BITS_PER_SAMPLE, offset); offset += 2; // BitsPerSample

  // ---- data sub-chunk ----
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  // ---- PCM samples (sine wave with fade-in/out) ----
  const amplitude = 0.6 * 32767; // ~60% of max to avoid clipping
  const fadeLen = Math.min(Math.floor(numSamples * 0.1), 2000); // 10% fade, max 2000 samples

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = Math.sin(2 * Math.PI * frequency * t);

    // Apply fade envelope
    let envelope = 1.0;
    if (i < fadeLen) {
      envelope = i / fadeLen; // Fade in
    } else if (i > numSamples - fadeLen) {
      envelope = (numSamples - i) / fadeLen; // Fade out
    }

    const value = Math.round(sample * amplitude * envelope);
    // Clamp to 16-bit signed range
    const clamped = Math.max(-32768, Math.min(32767, value));
    buffer.writeInt16LE(clamped, offset);
    offset += 2;
  }

  return buffer;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const outDir = path.join(__dirname, '..', 'src', 'assets', 'sounds');

  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Generating ${SOUNDS.length} placeholder sound files...`);
  console.log(`Output directory: ${outDir}\n`);

  for (const [filename, freq, durMs] of SOUNDS) {
    const filePath = path.join(outDir, filename);
    const wav = generateWav(freq, durMs);
    fs.writeFileSync(filePath, wav);
    const sizeKB = (wav.length / 1024).toFixed(1);
    console.log(`  [OK] ${filename}  (${freq}Hz, ${durMs}ms, ${sizeKB}KB)`);
  }

  console.log(`\nDone! ${SOUNDS.length} files written.`);
}

main();
