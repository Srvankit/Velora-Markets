import { motion } from 'framer-motion';
import { Sparkles, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { NewsSentimentGrid } from '@/components/ai/NewsSentimentCard';
import { AITimeline } from '@/components/ai/AITimeline';
import { GoalPlanner } from '@/components/ai/GoalPlanner';
import { aiInsights } from '@/data/aiInsights';

export default function AIInsightsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-sm text-muted-foreground">Deep intelligence about your portfolio and the market</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </div>

      {/* AI Portfolio Insights */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Portfolio Insights</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiInsights.map((insight, i) => (
            <AIInsightCard key={insight.id} insight={insight} delay={i * 0.05} showCategory />
          ))}
        </div>
      </section>

      {/* News Sentiment */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">News Sentiment Analysis</h2>
        <NewsSentimentGrid />
      </section>

      {/* Goal Planner */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Investment Goal Planner</h2>
        <GoalPlanner />
      </section>

      {/* Insight Timeline */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">AI Insight Timeline</h2>
        <AITimeline />
      </section>
    </motion.div>
  );
}
