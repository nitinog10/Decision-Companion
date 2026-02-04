"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DecisionResult, Option } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Check,
  X,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Clock,
  Target,
  Zap,
} from "lucide-react";

interface DecisionOutputProps {
  result: DecisionResult;
  onNewDecision: () => void;
}

function ImpactBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700">{score}/10</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-slate-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function OptionCard({
  option,
  index,
  isRecommended,
}: {
  option: Option;
  index: number;
  isRecommended: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card
        className={`relative transition-all ${
          isRecommended
            ? "ring-2 ring-emerald-500 shadow-lg"
            : "hover:shadow-md"
        }`}
      >
        {isRecommended && (
          <div className="absolute -top-3 left-4">
            <Badge className="bg-emerald-500 hover:bg-emerald-500 gap-1">
              <Sparkles className="h-3 w-3" />
              Recommended
            </Badge>
          </div>
        )}

        <CardHeader className={isRecommended ? "pt-8" : ""}>
          <CardTitle className="text-base font-semibold">{option.title}</CardTitle>
          <p className="text-sm text-slate-500 mt-1">{option.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                Pros
              </span>
              <ul className="space-y-1.5">
                {option.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-medium text-rose-600 uppercase tracking-wide">
                Cons
              </span>
              <ul className="space-y-1.5">
                {option.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Impact Scores */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <ImpactBar score={option.shortTermScore} label="Short-term impact" />
            <ImpactBar score={option.longTermScore} label="Long-term impact" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DecisionOutput({ result, onNewDecision }: DecisionOutputProps) {
  const [isExplanationOpen, setIsExplanationOpen] = useState(true);

  return (
    <div className="space-y-6">
      {/* Context Summary */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="outline" className="gap-1.5">
          <Target className="h-3 w-3" />
          {result.context.goal}
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Clock className="h-3 w-3" />
          {result.context.timeAvailable}
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Zap className="h-3 w-3" />
          {result.context.energyLevel} energy
        </Badge>
      </div>

      {/* Question */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{result.question}</h2>
      </div>

      {/* Explanation (Why this?) */}
      <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-emerald-50/50 transition-colors rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base font-semibold text-emerald-900">
                    Why this recommendation?
                  </CardTitle>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-emerald-600 transition-transform ${
                    isExplanationOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <p className="text-slate-700 leading-relaxed">{result.explanation}</p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Options Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          Your Options
        </h3>
        <div className="grid gap-4">
          {result.options.map((option, index) => (
            <OptionCard
              key={index}
              option={option}
              index={index}
              isRecommended={index === result.recommendedIndex}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-6 pb-8">
        <Button onClick={onNewDecision} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          New Decision
        </Button>
      </div>
    </div>
  );
}
