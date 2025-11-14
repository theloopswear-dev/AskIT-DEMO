import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Monitor, Square, Mic, Activity, Sparkles, Eye } from 'lucide-react';
import { useRealtimeVoice } from '../hooks/useRealtimeVoice';

export const AskITScreenShare: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
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
  } = useRealtimeVoice();

  const captureFrame = useCallback(async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      return canvas.toDataURL('image/jpeg', 0.7);
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  }, []);

  const startScreenAnalysis = useCallback(() => {
    if (intervalRef.current) return;

    setTimeout(async () => {
      const frame = await captureFrame();
      if (frame) {
        sendScreenContext(frame, 'Analyze this screen and provide step-by-step guidance in my language');
        setAnalysisCount(prev => prev + 1);
      }
    }, 3000);

    intervalRef.current = setInterval(async () => {
      const frame = await captureFrame();
      if (frame) {
        sendScreenContext(frame, 'Continue analyzing the current screen state');
        setAnalysisCount(prev => prev + 1);
      }
    }, 2500);

    console.log('Started automatic screen analysis every 2.5 seconds');
  }, [captureFrame, sendScreenContext]);

  const stopScreenAnalysis = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStartScreenShare = async () => {
    try {
      console.log('Starting AskIT screen share with voice...');

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });

      setStream(screenStream);
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        videoRef.current.play();
      }

      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        handleStopScreenShare();
      });

      setIsSharing(true);

      await connect();

      setTimeout(async () => {
        await startListening();
        startScreenAnalysis();
      }, 1000);

      console.log('AskIT ready: screen sharing + voice active');
    } catch (error) {
      console.error('Failed to start screen share:', error);
    }
  };

  const handleStopScreenShare = () => {
    console.log('Stopping AskIT screen share...');

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    stopListening();
    stopScreenAnalysis();
    disconnect();
    setIsSharing(false);
    setAnalysisCount(0);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      stopListening();
      stopScreenAnalysis();
      disconnect();
    };
  }, [stream, stopListening, stopScreenAnalysis, disconnect]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <canvas ref={canvasRef} className="hidden" />

      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/Untitled design (7).png"
                alt="AskIT AI Logo"
                className="w-12 h-12 object-contain rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AskIT AI</h1>
              <p className="text-sm text-gray-400">Your multilingual government services assistant</p>
            </div>
            {isSharing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-600/80 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-500/30 rounded-full">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300">AI Connected</span>
              </div>
            )}

            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/20 border border-blue-500/30 rounded-full">
                <Mic className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-sm text-blue-300">Listening</span>
              </div>
            )}

            {analysisCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/30 rounded-full">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">{analysisCount} analyses</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {!isSharing ? (
            <div className="glass-effect-bw rounded-2xl p-12 text-center border border-white/10">
              <Monitor className="w-24 h-24 mx-auto mb-6 text-white/50" />
              <h2 className="text-3xl font-bold mb-4">Welcome to AskIT AI</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Your intelligent assistant for government services. Speak naturally in Tamil, Telugu, Hindi, or English.
                AskIT will guide you step-by-step through any process.
              </p>

              <button
                onClick={handleStartScreenShare}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Monitor className="w-6 h-6" />
                Start Screen Share
              </button>

              <div className="mt-8 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="p-4 bg-white/5 rounded-lg">
                  <Mic className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Voice Active</h3>
                  <p className="text-sm text-gray-400">Automatic multilingual voice</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Screen Understanding</h3>
                  <p className="text-sm text-gray-400">Real-time visual analysis</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Step-by-Step</h3>
                  <p className="text-sm text-gray-400">Guided assistance</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-effect-bw rounded-xl overflow-hidden border border-white/10">
                <div className="relative bg-gray-900" style={{ minHeight: '500px' }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    autoPlay
                    muted
                    playsInline
                  />

                  <button
                    onClick={handleStopScreenShare}
                    className="absolute top-4 right-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg flex items-center gap-2"
                  >
                    <Square className="w-5 h-5" />
                    Stop Sharing
                  </button>

                  {isListening && (
                    <div className="absolute bottom-4 left-4 right-4 glass-effect-bw rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <Mic className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          {transcript && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-400">You said:</p>
                              <p className="text-white">{transcript}</p>
                            </div>
                          )}
                          {response && (
                            <div>
                              <p className="text-sm text-cyan-400">AskIT:</p>
                              <p className="text-white">{response}</p>
                            </div>
                          )}
                          {!transcript && !response && (
                            <p className="text-gray-400">Listening... Speak naturally in any language</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="glass-effect-bw rounded-lg p-4 border border-red-500/30 bg-red-900/20">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
          Powered by OpenAI Realtime API - Supports Tamil, Telugu, Hindi, English, and more
        </div>
      </footer>
    </div>
  );
};
