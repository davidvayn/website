"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VoiceStatus = "idle" | "listening" | "unsupported" | "error";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  abort: () => void;
  start: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface UseVoiceSearchOptions {
  onResult: (transcript: string) => void;
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

function getFinalTranscript(event: SpeechRecognitionEventLike) {
  const transcripts: string[] = [];

  for (let i = 0; i < event.results.length; i += 1) {
    const result = event.results[i];
    if (result.isFinal && result[0]?.transcript) {
      transcripts.push(result[0].transcript);
    }
  }

  return transcripts.join(" ").trim();
}

export function useVoiceSearch({ onResult }: UseVoiceSearchOptions) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onResultRef = useRef(onResult);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    queueMicrotask(() => {
      if (!getSpeechRecognitionConstructor()) {
        setStatus("unsupported");
        setMessage("Voice search is not supported in this browser.");
      }
    });

    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition) {
      setStatus("unsupported");
      setMessage("Voice search is not supported in this browser.");
      return;
    }

    recognitionRef.current?.abort();

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event) => {
      const transcript = getFinalTranscript(event);
      if (transcript) {
        onResultRef.current(transcript);
        setMessage(`Heard ${transcript}`);
      }
    };

    recognition.onerror = (event) => {
      setStatus("error");
      setMessage(
        event.error === "not-allowed"
          ? "Microphone permission was denied."
          : "Voice search could not hear a search."
      );
    };

    recognition.onend = () => {
      setStatus((currentStatus) =>
        currentStatus === "unsupported" ? "unsupported" : "idle"
      );
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      setStatus("listening");
      setMessage("Listening for a search.");
    } catch {
      setStatus("error");
      setMessage("Voice search could not start.");
      recognitionRef.current = null;
    }
  }, []);

  return {
    isListening: status === "listening",
    isSupported: status !== "unsupported",
    message,
    startListening,
    status,
  };
}
