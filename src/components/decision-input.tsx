"use client";

import { useState } from "react";
import { DecisionContext, Goal, EnergyLevel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Clock,
  Wallet,
  Zap,
  ArrowRight,
  Briefcase,
  DollarSign,
  Heart,
  BookOpen,
  CheckSquare,
  Users,
} from "lucide-react";

interface DecisionInputProps {
  onSubmit: (context: DecisionContext) => void;
}

const GOALS: { value: Goal; label: string; icon: React.ElementType }[] = [
  { value: "career", label: "Career", icon: Briefcase },
  { value: "money", label: "Money", icon: DollarSign },
  { value: "health", label: "Health", icon: Heart },
  { value: "learning", label: "Learning", icon: BookOpen },
  { value: "productivity", label: "Productivity", icon: CheckSquare },
  { value: "relationships", label: "Relationships", icon: Users },
];

const ENERGY_LEVELS: { value: EnergyLevel; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "high", label: "High", color: "bg-green-100 text-green-700 border-green-200" },
];

const EXAMPLE_QUESTIONS = [
  "Should I attend class or work on my project?",
  "Should I order food or cook at home?",
  "Should I learn React or continue ML?",
];

export function DecisionInput({ onSubmit }: DecisionInputProps) {
  const [question, setQuestion] = useState("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [budget, setBudget] = useState("");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | "">("");

  const isValid = question.trim() && goal && timeAvailable.trim() && energyLevel;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      question: question.trim(),
      goal: goal as Goal,
      timeAvailable: timeAvailable.trim(),
      budget: budget.trim() || undefined,
      energyLevel: energyLevel as EnergyLevel,
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">
          What decision are you facing?
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Describe your decision and context. I'll help you think through your options clearly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Decision Question */}
        <Card>
          <CardContent className="pt-6">
            <Label htmlFor="question" className="text-sm font-medium text-slate-700">
              Your Decision
            </Label>
            <Textarea
              id="question"
              placeholder="e.g., Should I attend the networking event or focus on my side project tonight?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-2 min-h-[100px] resize-none"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-slate-400">Try:</span>
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuestion(q)}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Context Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goal */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-slate-500" />
                <Label className="text-sm font-medium text-slate-700">Primary Goal</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {GOALS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGoal(value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                      goal === value
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${goal === value ? "text-slate-900" : "text-slate-400"}`} />
                    <span className={`text-xs ${goal === value ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Energy Level */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-slate-500" />
                <Label className="text-sm font-medium text-slate-700">Energy Level</Label>
              </div>
              <div className="flex gap-2">
                {ENERGY_LEVELS.map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEnergyLevel(value)}
                    className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                      energyLevel === value
                        ? color
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Available */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-slate-500" />
                <Label htmlFor="time" className="text-sm font-medium text-slate-700">
                  Time Available
                </Label>
              </div>
              <Input
                id="time"
                placeholder="e.g., 2 hours, this evening, weekend"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Budget */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-4 w-4 text-slate-500" />
                <Label htmlFor="budget" className="text-sm font-medium text-slate-700">
                  Budget <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
              </div>
              <Input
                id="budget"
                placeholder="e.g., $50, limited, not a concern"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={!isValid}
            className="px-8 gap-2"
          >
            Analyze Decision
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
