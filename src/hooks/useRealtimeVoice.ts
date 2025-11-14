import { useState, useCallback, useRef, useEffect } from 'react';
import { createRealtimeService } from '../services/openaiRealtime';

export const useRealtimeVoice = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef<ReturnType<typeof createRealtimeService> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not found');
      }

      serviceRef.current = createRealtimeService({
        apiKey,
        onTranscript: (text) => {
          console.log('User said:', text);
          setTranscript(text);
        },
        onResponse: (text, audio) => {
          if (text) {
            console.log('AI responded:', text);
            setResponse(text);
          }
          if (audio && audio.byteLength > 0) {
            playAudio(audio);
          }
        },
        onError: (err) => {
          console.error('Realtime error:', err);
          setError(err.message);
        },
      });

      await serviceRef.current.connect();
      setIsConnected(true);
      console.log('OpenAI Realtime connected successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMsg);
      console.error('Connection error:', err);
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!serviceRef.current || !isConnected) {
      console.error('Service not connected');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        }
      });

      streamRef.current = stream;
      await serviceRef.current.startListening(stream);
      setIsListening(true);
      console.log('Started listening');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start listening';
      setError(errorMsg);
      console.error('Listening error:', err);
    }
  }, [isConnected]);

  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  }, []);

  const sendScreenContext = useCallback((imageData: string, message?: string) => {
    if (serviceRef.current && isConnected) {
      serviceRef.current.sendScreenContext(imageData, message);
    }
  }, [isConnected]);

  const disconnect = useCallback(() => {
    stopListening();
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      serviceRef.current = null;
    }
    setIsConnected(false);
    setTranscript('');
    setResponse('');
  }, [stopListening]);

  const playAudio = async (audioData: ArrayBuffer) => {
    try {
      const audioContext = new AudioContext({ sampleRate: 24000 });
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isListening,
    transcript,
    response,
    error,
    connect,
    startListening,
    stopListening,
    sendScreenContext,
    disconnect,
  };
};
