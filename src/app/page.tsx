"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DecisionContext, DecisionResult } from "@/lib/types";
import { DecisionInput } from "@/components/decision-input";
import { DecisionOutput } from "@/components/decision-output";
import { DecisionHistory } from "@/components/decision-history";
import { ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppState = "input" | "loading" | "result";

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [history, setHistory] = useState<DecisionResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (context: DecisionContext) => {
    setState("loading");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze decision");
      }

      const data: DecisionResult = await response.json();
      setResult(data);
      
      // Add to history (keep last 5)
      setHistory((prev) => [data, ...prev].slice(0, 5));
      setState("result");
    } catch (error) {
      console.error("Error:", error);
      setState("input");
    }
  };

  const handleNewDecision = () => {
    setResult(null);
    setState("input");
  };

  const handleSelectFromHistory = (decision: DecisionResult) => {
    setResult(decision);
    setState("result");
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {state === "result" && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleNewDecision}
                className="mr-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Decision Companion</h1>
              <p className="text-xs text-slate-500">Clarity for your daily choices</p>
            </div>
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
          )}
        </div>
      </header>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <DecisionHistory
            history={history}
            onSelect={handleSelectFromHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {state === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DecisionInput onSubmit={handleSubmit} />
            </motion.div>
          )}

          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-slate-600 animate-spin" />
              </div>
              <p className="mt-6 text-slate-600">Thinking through your decision...</p>
              <p className="mt-1 text-sm text-slate-400">Analyzing options and tradeoffs</p>
            </motion.div>
          )}

          {state === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DecisionOutput result={result} onNewDecision={handleNewDecision} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
