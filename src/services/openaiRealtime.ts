interface RealtimeConfig {
  apiKey: string;
  onTranscript?: (text: string) => void;
  onResponse?: (text: string, audio: ArrayBuffer) => void;
  onError?: (error: Error) => void;
}

class OpenAIRealtimeService {
  private apiKey: string;
  private ws: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private isConnected = false;
  private config: RealtimeConfig;

  constructor(config: RealtimeConfig) {
    this.apiKey = config.apiKey;
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          voice: 'alloy',
          instructions: 'You are AskIT AI, a helpful assistant that provides step-by-step guidance for government services and everyday tasks. You understand and respond in the user\'s native language (Tamil, Telugu, Hindi, English, etc.). When analyzing screenshots, provide clear, actionable instructions based on what you see on screen.',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
      }

      const session = await response.json();

      this.ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'OpenAI-Beta': 'realtime=v1',
          },
        } as any
      );

      this.ws.onopen = () => {
        console.log('OpenAI Realtime connected');
        this.isConnected = true;
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.config.onError?.(new Error('WebSocket connection error'));
      };

      this.ws.onclose = () => {
        console.log('OpenAI Realtime disconnected');
        this.isConnected = false;
      };

    } catch (error) {
      console.error('Failed to connect to OpenAI Realtime:', error);
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      if (message.type === 'conversation.item.created' && message.item.type === 'message') {
        const content = message.item.content?.[0];
        if (content?.type === 'text') {
          this.config.onTranscript?.(content.text);
        }
      }

      if (message.type === 'response.audio.delta') {
        const audioData = this.base64ToArrayBuffer(message.delta);
        this.config.onResponse?.('', audioData);
      }

      if (message.type === 'response.text.delta') {
        this.config.onResponse?.(message.delta, new ArrayBuffer(0));
      }

    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async startListening(stream: MediaStream): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to OpenAI Realtime');
    }

    try {
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      const source = this.audioContext.createMediaStreamSource(stream);

      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(this.audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const audioData = e.inputBuffer.getChannelData(0);
          const pcm16 = this.floatTo16BitPCM(audioData);
          const base64Audio = this.arrayBufferToBase64(pcm16);

          this.ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
          }));
        }
      };

      console.log('Started listening with OpenAI Realtime');
    } catch (error) {
      console.error('Failed to start listening:', error);
      throw error;
    }
  }

  sendScreenContext(imageData: string, userMessage?: string): void {
    if (!this.isConnected || !this.ws) {
      console.warn('Cannot send screen context: not connected');
      return;
    }

    const base64Image = imageData.split(',')[1];

    this.ws.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: userMessage || 'Analyze this screen and help me with the next steps'
          },
          {
            type: 'input_image',
            image: base64Image,
          }
        ]
      }
    }));

    this.ws.send(JSON.stringify({
      type: 'response.create',
    }));
  }

  private floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const createRealtimeService = (config: RealtimeConfig) => {
  return new OpenAIRealtimeService(config);
};
