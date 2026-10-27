import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechEngine(defaultScript = 'Explain the difference between mitosis and meiosis in simple bullet points.') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.15); // 0.0 to 1.0 for visualizer
  const [duration, setDuration] = useState(0);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  // Stable references to prevent dependency cascades and unwanted restarts
  const isListeningRef = useRef(false);
  const transcriptRef = useRef('');
  const finalTranscriptAccumulator = useRef('');
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const simIntervalRef = useRef(null);
  const animFrameRef = useRef(null);
  const personaScriptRef = useRef(defaultScript);

  useEffect(() => {
    personaScriptRef.current = defaultScript;
  }, [defaultScript]);

  // Clean up audio hardware and timers cleanly
  const cleanup = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop error if already stopped
      }
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {
        // Ignore track error
      }
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Ignore close error
      }
      audioContextRef.current = null;
    }
  }, []);

  // Simulated Voice Stream Fallback / Demo Mode
  const startSimulatedListening = useCallback((script) => {
    cleanup();

    setIsSimulated(true);
    setIsListening(true);
    isListeningRef.current = true;
    setTranscript('');
    setInterimTranscript('');
    transcriptRef.current = '';
    finalTranscriptAccumulator.current = '';
    setDuration(0);

    const textToStream = script || personaScriptRef.current || defaultScript;
    const words = textToStream.split(' ');
    let wordIdx = 0;

    // Elapsed timer
    timerIntervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Progressive simulated stream
    simIntervalRef.current = setInterval(() => {
      if (!isListeningRef.current) return;

      if (wordIdx < words.length) {
        const nextWord = words[wordIdx];
        transcriptRef.current = transcriptRef.current ? `${transcriptRef.current} ${nextWord}` : nextWord;
        setTranscript(transcriptRef.current);
        setAudioLevel(0.45 + Math.random() * 0.45);
        wordIdx++;
      } else {
        setAudioLevel(0.18); // Soft idle breathing
      }
    }, 320);

    // Parametric sine-wave oscillation for audio visualizer
    let t = 0;
    const animateSimWave = () => {
      if (!isListeningRef.current) return;
      t += 0.06;
      const baseAmp = wordIdx < words.length ? 0.65 : 0.25;
      const wave = Math.abs(Math.sin(t) * baseAmp + Math.cos(t * 1.8) * 0.2);
      setAudioLevel(Math.min(1.0, Math.max(0.15, wave)));
      animFrameRef.current = requestAnimationFrame(animateSimWave);
    };
    animFrameRef.current = requestAnimationFrame(animateSimWave);
  }, [cleanup, defaultScript]);

  // Primary Start Listening (Attempts Live Microphone first, with auto-retry on pause)
  const startListening = useCallback(async (customScript) => {
    cleanup();

    const scriptToUse = customScript || personaScriptRef.current || defaultScript;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // If browser completely lacks Web Speech API, use simulated mode
    if (!SpeechRecognition) {
      console.log('Web Speech API not supported in this browser; using simulated voice capture.');
      startSimulatedListening(scriptToUse);
      return;
    }

    try {
      // 1. Request real microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;
      setMicPermission('granted');

      // 2. Set up Web Audio Analyser for responsive waveform
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.6;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Volume sampler loop with amplified responsiveness
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioLevel = () => {
        if (!analyserRef.current || !isListeningRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Non-linear boost so normal voice registers as vibrant movement (0.2 to 0.95)
        const boosted = Math.min(1.0, Math.max(0.12, (avg / 32) * 1.3));
        setAudioLevel(boosted);
        animFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      animFrameRef.current = requestAnimationFrame(updateAudioLevel);

      // 3. Initialize SpeechRecognition
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      isListeningRef.current = true;
      setIsListening(true);
      setIsSimulated(false);
      setTranscript('');
      setInterimTranscript('');
      transcriptRef.current = '';
      finalTranscriptAccumulator.current = '';
      setDuration(0);

      // Timer counter
      timerIntervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscriptAccumulator.current += item[0].transcript + ' ';
          } else {
            interim += item[0].transcript;
          }
        }

        const combined = (finalTranscriptAccumulator.current + interim).trim();
        transcriptRef.current = combined;
        setTranscript(finalTranscriptAccumulator.current.trim());
        setInterimTranscript(interim.trim());
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition event error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermission('denied');
          startSimulatedListening(scriptToUse);
        }
        // Do NOT abort on 'no-speech' or 'audio-capture' - stay listening!
      };

      recognition.onend = () => {
        // If user is still in the modal and listening, auto-restart to prevent unexpected cutoff
        if (isListeningRef.current && recognitionRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already started or restarting
          }
        }
      };

      recognition.start();

    } catch (err) {
      console.warn('Microphone getUserMedia rejected or unavailable:', err);
      setMicPermission('denied');
      startSimulatedListening(scriptToUse);
    }
  }, [cleanup, defaultScript, startSimulatedListening]);

  // Stop listening and return latest captured transcript
  const stopListening = useCallback(() => {
    const finalResult = (finalTranscriptAccumulator.current + ' ' + (transcriptRef.current || '')).trim();
    cleanup();
    return finalResult;
  }, [cleanup]);

  // Cancel listening and clear all
  const cancelListening = useCallback(() => {
    cleanup();
    setTranscript('');
    setInterimTranscript('');
    transcriptRef.current = '';
    finalTranscriptAccumulator.current = '';
  }, [cleanup]);

  // Toggle directly to simulated demonstration mode
  const toggleDemoMode = useCallback((script) => {
    startSimulatedListening(script || personaScriptRef.current);
  }, [startSimulatedListening]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript: (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim(),
    isSimulated,
    audioLevel,
    duration,
    micPermission,
    startListening,
    stopListening,
    cancelListening,
    toggleDemoMode
  };
}
