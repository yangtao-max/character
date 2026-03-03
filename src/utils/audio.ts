export async function playPCM(base64Data: string, sampleRate: number = 24000) {
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // PCM data from Gemini is typically 16-bit little-endian
  const buffer = new Int16Array(bytes.buffer);
  
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = audioCtx.createBuffer(1, buffer.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < buffer.length; i++) {
    channelData[i] = buffer[i] / 32768.0; // Convert 16-bit int to float [-1, 1]
  }

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();
  
  return new Promise(resolve => {
    source.onended = resolve;
  });
}
