import { NextRequest, NextResponse } from "next/server";
import { DecisionContext, DecisionResult, Option } from "@/lib/types";

const SYSTEM_PROMPT = `You are a decision-making assistant that helps users think through daily decisions clearly. Your job is to analyze the user's decision question and context, then provide 2-3 distinct options with pros/cons and a clear recommendation.

RULES:
- Be concise. No long paragraphs.
- Be practical and context-aware (consider their energy level, time, budget, goal).
- Always explain WHY you recommend a particular option.
- Impact scores range from 1-10 (1 = minimal impact, 10 = life-changing).
- Short-term = next few hours/days. Long-term = weeks/months/years.
- Be supportive but honest. Don't give generic advice.
- Tailor recommendations to the user's stated goal.

RESPONSE FORMAT (JSON only, no markdown):
{
  "options": [
    {
      "title": "Brief option name",
      "description": "1-2 sentence description",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "shortTermScore": 7,
      "longTermScore": 8
    }
  ],
  "recommendedIndex": 0,
  "explanation": "2-3 sentences explaining WHY this option is best given their context."
}`;

function buildUserPrompt(context: DecisionContext): string {
  return `DECISION: ${context.question}

CONTEXT:
- Primary Goal: ${context.goal}
- Time Available: ${context.timeAvailable}
- Energy Level: ${context.energyLevel}
${context.budget ? `- Budget: ${context.budget}` : "- Budget: Not a concern"}

Analyze this decision and provide 2-3 options with your recommendation.`;
}

// Fallback mock response for when API key is not configured
function getMockResponse(context: DecisionContext): Omit<DecisionResult, "id" | "question" | "context" | "createdAt"> {
  const options: Option[] = [
    {
      title: "Option A: Take action now",
      description: "Move forward with the first choice that aligns with your immediate needs.",
      pros: [
        "Immediate progress",
        "Builds momentum",
        `Matches your ${context.energyLevel} energy level`
      ],
      cons: [
        "Less time to consider alternatives",
        "May miss better opportunities"
      ],
      shortTermScore: 8,
      longTermScore: 6
    },
    {
      title: "Option B: Delay for more information",
      description: "Take time to gather more context before making a final decision.",
      pros: [
        "More informed decision",
        "Reduces risk of regret",
        "Allows for better preparation"
      ],
      cons: [
        "Opportunity cost of waiting",
        "Analysis paralysis risk"
      ],
      shortTermScore: 5,
      longTermScore: 7
    },
    {
      title: "Option C: Hybrid approach",
      description: "Start with a small commitment while keeping options open.",
      pros: [
        "Balanced approach",
        "Flexibility maintained",
        "Learn through action"
      ],
      cons: [
        "Divided focus",
        "May take longer overall"
      ],
      shortTermScore: 7,
      longTermScore: 8
    }
  ];

  const recommendedIndex = context.energyLevel === "high" ? 0 : context.energyLevel === "low" ? 1 : 2;

  return {
    options,
    recommendedIndex,
    explanation: `Given your ${context.energyLevel} energy level and focus on ${context.goal}, ${options[recommendedIndex].title.split(":")[1].trim().toLowerCase()} is the best approach. This balances your available time (${context.timeAvailable}) with meaningful progress toward your goal.`
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const context: DecisionContext = body.context;

    if (!context.question || !context.goal || !context.timeAvailable || !context.energyLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    let responseData: Omit<DecisionResult, "id" | "question" | "context" | "createdAt">;

    if (apiKey) {
      // Use OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(context) },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        // Fall back to mock response
        responseData = getMockResponse(context);
      } else {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
          responseData = getMockResponse(context);
        } else {
          try {
            // Clean the response - remove markdown code blocks if present
            const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            responseData = JSON.parse(cleanedContent);
          } catch {
            console.error("Failed to parse OpenAI response:", content);
            responseData = getMockResponse(context);
          }
        }
      }
    } else {
      // Use mock response when no API key
      responseData = getMockResponse(context);
    }

    const result: DecisionResult = {
      id: crypto.randomUUID(),
      question: context.question,
      context,
      options: responseData.options,
      recommendedIndex: responseData.recommendedIndex,
      explanation: responseData.explanation,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing decision:", error);
    return NextResponse.json(
      { error: "Failed to analyze decision" },
      { status: 500 }
    );
  }
}
