import { motion } from 'framer-motion';
import { Shield, Download, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiskGauge } from '@/components/ai/RiskGauge';
import { SentimentMeter } from '@/components/ai/SentimentMeter';

export default function AIRiskAnalysisPage() {
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
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">AI Risk Analysis</h1>
            <p className="text-sm text-muted-foreground">Comprehensive risk assessment powered by AI</p>
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

      <Card className="relative overflow-hidden border-primary/20 p-5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <h3 className="font-display text-base font-semibold">Risk Overview</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Your portfolio risk profile is moderate with a risk score of 6.2/10. Technology sector concentration is the primary driver of elevated risk. Liquidity risk is low as all holdings are highly liquid. The Sharpe ratio of 1.42 indicates strong risk-adjusted returns. Consider rebalancing to reduce sector concentration and improve the overall risk profile.
          </p>
        </div>
      </Card>

      <RiskGauge />

      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Market Sentiment & Risk Context</h2>
        <SentimentMeter />
      </section>
    </motion.div>
  );
}
