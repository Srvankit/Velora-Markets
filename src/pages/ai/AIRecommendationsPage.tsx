import { motion } from 'framer-motion';
import { Lightbulb, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIRecommendationCard } from '@/components/ai/AIRecommendationCard';
import { OpportunityGrid } from '@/components/ai/OpportunityCard';
import { recommendations } from '@/data/recommendations';

export default function AIRecommendationsPage() {
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
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">AI Recommendations</h1>
            <p className="text-sm text-muted-foreground">Personalized investment recommendations powered by AI</p>
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

      {/* Recommendations */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Personalized Recommendations</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec, i) => (
            <AIRecommendationCard key={rec.id} recommendation={rec} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Market Opportunities */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Market Opportunities</h2>
        <OpportunityGrid />
      </section>
    </motion.div>
  );
}
