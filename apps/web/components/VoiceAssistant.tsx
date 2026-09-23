"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@leaflens/shared";
import { Loader2, Mic, Send, Speaker, Square } from "lucide-react";

type SpeechRecognitionEventLike = Event & {
  results: { 0: { 0: { transcript: string } } };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export default function VoiceAssistant({ diagnosis }: { diagnosis: AnalysisResult }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => voice.lang.toLowerCase().startsWith("jv")) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("id")) ||
      null;
    utterance.lang = utterance.voice?.lang || "id-ID";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      setError("Browser iki durung ndhukung input swara. Pitakon isih bisa diketik.");
      return;
    }

    const recognition = new Recognition() as SpeechRecognitionLike;
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      setQuestion(event.results[0][0].transcript);
      setError("");
    };
    recognition.onerror = () => setError("Swara ora kasil diwaca. Coba maneh utawa ketik pitakone.");
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    setError("");
    recognition.start();
  }

  async function ask() {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const response = await fetch("/api/v1/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, diagnosis }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.answer !== "string") {
        throw new Error(data?.detail || "Asisten ora bisa njawab saiki.");
      }
      setAnswer(data.answer);
      speak(data.answer);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Asisten ora bisa njawab saiki.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-emerald-200/80 bg-white/80 p-6 shadow-sm dark:border-emerald-900/70 dark:bg-slate-900/80">
      <div>
        <h2 className="text-base font-black text-slate-900 dark:text-white">Tanya Asisten Tani</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Takon nganggo basa Jawa babagan asil scan iki.</p>
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && void ask()}
          maxLength={500}
          placeholder="Tuladha: Iki obate opo mas?"
          aria-label="Pitakon kanggo asisten tani"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="button"
          onClick={toggleListening}
          title={listening ? "Mandheg ngrungokake" : "Takon nganggo swara"}
          aria-label={listening ? "Mandheg ngrungokake" : "Takon nganggo swara"}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${listening ? "bg-rose-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
        >
          {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => void ask()}
          disabled={!question.trim() || loading}
          title="Kirim pitakon"
          aria-label="Kirim pitakon"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      {listening && <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ngrungokake...</p>}
      {error && <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>}
      {answer && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{answer}</p>
          <button
            type="button"
            onClick={() => speak(answer)}
            title="Wacanen maneh"
            aria-label="Wacanen maneh"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
          >
            <Speaker className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
