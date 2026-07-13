"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import RecommendationEngine, {
  RecommendationContext,
} from "@/lib/recommendations";
import { Sparkles, TrendingUp, RefreshCw } from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
}

interface RecommendationsPanelProps {
  tools: Tool[];
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  onSelectTool: (selection: { toolId: string }) => void;
}

export default function RecommendationsPanel({
  tools,
  onSelectTool,
}: RecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [insight, setInsight] = useState<string>("");
  const baseContext = useMemo<
    Pick<RecommendationContext, "timeOfDay" | "dayOfWeek">
  >(
    () => ({
      timeOfDay: RecommendationEngine.getTimeOfDay(),
      dayOfWeek: new Date().getDay(),
    }),
    [],
  );
  const [timeAvailable, setTimeAvailable] = useState<
    "quick" | "moderate" | "long"
  >("moderate");
  const [stressLevel, setStressLevel] = useState<"high" | "medium" | "low">(
    "medium",
  );

  const updateRecommendations = useCallback(() => {
    const newContext: RecommendationContext = {
      ...baseContext,
      timeAvailable,
      recentStress: stressLevel,
    };

    const recs = RecommendationEngine.getRecommendations(newContext);
    setRecommendations(recs);
    setInsight(RecommendationEngine.getInsight());
  }, [baseContext, stressLevel, timeAvailable]);

  useEffect(() => {
    updateRecommendations();
  }, [updateRecommendations]);

  const getRecommendedTools = () => {
    return recommendations
      .map((recId) => tools.find((tool) => tool.id === recId))
      .filter(Boolean) as Tool[];
  };

  const getStressIcon = (level: string) => {
    switch (level) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "🟡";
    }
  };

  const getTimeIcon = (time: string) => {
    switch (time) {
      case "quick":
        return "⚡";
      case "moderate":
        return "⏰";
      case "long":
        return "🧘";
      default:
        return "⏰";
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          <CardTitle className="text-base sm:text-lg">
            Personalized Recommendations
          </CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm mt-1">
          Based on your preferences and current needs
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Context Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">
              How are you feeling?
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-1">
              {(["high", "medium", "low"] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => setStressLevel(level)}
                  variant={stressLevel === level ? "calm" : "outline"}
                  size="sm"
                  className={` sm:text-xs touch-manipulation min-h-[44px] ${stressLevel === level ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white" : ""}`}
                >
                  <span className="text-xs sm:text-sm">
                    {getStressIcon(level)}
                  </span>
                  <span className="hidden sm:inline">
                    {" "}
                    {level === "high"
                      ? "Stressed"
                      : level === "medium"
                        ? "Okay"
                        : "Calm"}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">
              Time available?
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-1">
              {(["quick", "moderate", "long"] as const).map((time) => (
                <Button
                  key={time}
                  onClick={() => setTimeAvailable(time)}
                  variant={timeAvailable === time ? "calm" : "outline"}
                  size="sm"
                  className={` sm:text-xs touch-manipulation min-h-[44px] ${timeAvailable === time ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white" : ""}`}
                >
                  <span className="text-xs sm:text-sm">
                    {getTimeIcon(time)}
                  </span>
                  <span className="hidden sm:inline">
                    {" "}
                    {time === "quick"
                      ? "<3min"
                      : time === "moderate"
                        ? "3-10min"
                        : "10min+"}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Insight */}
        <AnimatePresence mode="wait">
          {insight && (
            <motion.div
              key={insight}
              className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2.5 sm:p-3 border border-purple-200 dark:border-purple-800"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm leading-relaxed">{insight}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended Tools */}
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-xs sm:text-sm font-medium">
              Suggested for you right now:
            </h3>
            <Button
              onClick={updateRecommendations}
              variant="ghost"
              size="sm"
              className="p-1 touch-manipulation min-w-[44px] min-h-[44px]"
            >
              <RefreshCw size={16} />
            </Button>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {getRecommendedTools()
              .slice(0, 4)
              .map((tool, index) => (
                <motion.div
                  key={tool.id}
                  variants={itemVariants}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                >
                  <Card
                    className="cursor-pointer bg-white/80 dark:bg-gray-800/80 border-purple-100 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-colors touch-manipulation"
                    onClick={() => onSelectTool({ toolId: tool.id })}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                        <h4 className="font-medium text-xs sm:text-sm truncate flex-1">
                          {tool.title}
                        </h4>
                        {index === 0 && (
                          <span className="sm:text-xs bg-purple-100 dark:bg-purple-900/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                            Top Pick
                          </span>
                        )}
                      </div>
                      <p className="sm:text-xs mb-2 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="sm:text-xs">{tool.duration}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="sm:text-xs p-1 h-auto touch-manipulation min-h-[36px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTool({ toolId: tool.id });
                          }}
                        >
                          Try Now →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </motion.div>

          {getRecommendedTools().length === 0 && (
            <div className="text-center py-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs sm:text-sm">
                Use a few tools to get personalized recommendations!
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/40 dark:bg-gray-800/40 rounded-lg p-2.5 sm:p-3">
          <p className="sm:text-xs text-center leading-relaxed">
            💡 The more you use CalmMyself, the smarter these recommendations
            become
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
