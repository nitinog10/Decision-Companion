"use client";

import { motion } from "framer-motion";
import { DecisionResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Clock } from "lucide-react";

interface DecisionHistoryProps {
  history: DecisionResult[];
  onSelect: (decision: DecisionResult) => void;
  onClose: () => void;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
}

export function DecisionHistory({ history, onSelect, onClose }: DecisionHistoryProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 z-20"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-30 overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Decisions</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {history.map((decision) => (
            <Card
              key={decision.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelect(decision)}
            >
              <CardContent className="p-4">
                <p className="text-sm font-medium text-slate-900 line-clamp-2">
                  {decision.question}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(decision.createdAt)}
                  <span className="text-slate-300">•</span>
                  <span className="capitalize">{decision.context.goal}</span>
                </div>
                <p className="text-xs text-emerald-600 mt-2">
                  Recommended: {decision.options[decision.recommendedIndex]?.title.split(":")[0] || "Option"}
                </p>
              </CardContent>
            </Card>
          ))}

          {history.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No decisions yet. Start by making your first decision!
            </p>
          )}
        </div>
      </motion.div>
    </>
  );
}
