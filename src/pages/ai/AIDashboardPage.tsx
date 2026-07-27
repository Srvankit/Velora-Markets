import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Download, Share2, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIHealthScore } from '@/components/ai/AIHealthScore';
import { SentimentMeter } from '@/components/ai/SentimentMeter';
import { OpportunityGrid } from '@/components/ai/OpportunityCard';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { AITimeline } from '@/components/ai/AITimeline';
import { dailyAISummary, smartAlerts, trendingSectors, portfolioAnalysis, watchlistAnalysis } from '@/data/aiInsights';
import { recommendations } from '@/data/recommendations';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const alertIconMap: Record<string, typeof AlertTriangle> = { AlertTriangle, Wallet: DollarSign, Sparkles, DollarSign };
const alertTypeConfig = {
  positive: { color: 'text-success', bg: 'bg-success/10' },
  neutral: { color: 'text-primary', bg: 'bg-primary/10' },
  warning: { color: 'text-warning', bg: 'bg-warning/10' },
};

const watchlistCategoryConfig = {
  overvalued: { label: 'Overvalued', className: 'bg-danger/10 text-danger' },
  undervalued: { label: 'Undervalued', className: 'bg-success/10 text-success' },
  high_momentum: { label: 'High Momentum', className: 'bg-primary/10 text-primary' },
  high_risk: { label: 'High Risk', className: 'bg-warning/10 text-warning' },
};

export default function AIDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">AI Intelligence</h1>
            <p className="text-sm text-muted-foreground">Your investment intelligence dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </motion.div>

      {/* Today's AI Summary */}
      <Card className="relative overflow-hidden border-primary/20 p-5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-semibold">Today's AI Summary</h3>
            <Badge variant="outline" className="border-0 bg-primary/10 text-xs text-primary">Live</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{dailyAISummary.summary}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {dailyAISummary.highlights.map((hl, i) => (
              <motion.div
                key={hl.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-lg border border-border bg-card/40 p-3"
              >
                <p className="text-xs text-muted-foreground">{hl.label}</p>
                <p className={cn('mt-0.5 text-sm font-bold', hl.positive ? 'text-success' : 'text-danger')}>{hl.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Portfolio Health Score */}
      <section>
        <SectionTitle icon={ShieldCheck} title="Portfolio Health Score" />
        <AIHealthScore />
      </section>

      {/* Quick Recommendations */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle icon={TrendingUp} title="Quick Recommendations" />
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/ai/recommendations')}>View All</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.slice(0, 3).map((rec, i) => (
            <AIInsightCard
              key={rec.id}
              insight={{ id: rec.id, title: rec.title, description: rec.reason, type: rec.priority === 'high' ? 'warning' : rec.priority === 'medium' ? 'neutral' : 'positive', confidence: rec.confidence, icon: rec.icon, category: rec.category }}
              delay={i * 0.05}
              showCategory
            />
          ))}
        </div>
      </section>

      {/* Market Sentiment */}
      <section>
        <SectionTitle icon={TrendingUp} title="Market Sentiment" />
        <SentimentMeter />
      </section>

      {/* Market Opportunities */}
      <section>
        <SectionTitle icon={Sparkles} title="Investment Opportunities" />
        <OpportunityGrid />
      </section>

      {/* Smart Alerts */}
      <section>
        <SectionTitle icon={AlertTriangle} title="Smart Alerts" />
        <div className="grid gap-3 sm:grid-cols-2">
          {smartAlerts.map((alert, i) => {
            const Icon = alertIconMap[alert.icon] ?? AlertTriangle;
            const config = alertTypeConfig[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="flex items-start gap-3 p-4">
                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', config.bg, config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(alert.timestamp)}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trending Sectors */}
      <section>
        <SectionTitle icon={TrendingUp} title="Trending Sectors" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {trendingSectors.map((sector, i) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card className="p-3 transition-shadow hover:shadow-card-hover">
                <p className="text-xs font-medium">{sector.name}</p>
                <p className={cn('mt-1 text-sm font-bold', sector.changePercent >= 0 ? 'text-success' : 'text-danger')}>
                  {sector.changePercent >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">Top: {sector.topStock}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Portfolio Analysis */}
      <section>
        <SectionTitle icon={Sparkles} title="AI Portfolio Analysis" />
        <div className="grid gap-3 sm:grid-cols-2">
          {portfolioAnalysis.map((point, i) => (
            <AIInsightCard
              key={point.id}
              insight={{ id: point.id, title: point.title, description: point.description, type: point.type, confidence: 85 - i * 3, icon: point.icon }}
              delay={i * 0.05}
            />
          ))}
        </div>
      </section>

      {/* Watchlist Analysis */}
      <section>
        <SectionTitle icon={TrendingUp} title="Watchlist Analysis" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {watchlistAnalysis.map((item, i) => {
            const catConfig = watchlistCategoryConfig[item.category];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Card className="h-full p-4 transition-shadow hover:shadow-card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: item.logoColor }}>
                        {item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.symbol}</p>
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className={cn('rounded-lg px-2 py-0.5 text-[10px] font-medium', catConfig.className)}>
                      {catConfig.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.aiAnalysis}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">AI Confidence</span>
                    <span className="font-medium">{item.confidence}%</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI Insight Timeline */}
      <section>
        <SectionTitle icon={TrendingUp} title="AI Insight Timeline" />
        <AITimeline />
      </section>

      {/* Navigation to other AI pages */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NavCard title="AI Chat" description="Chat with your AI assistant" onClick={() => navigate('/ai/chat')} />
        <NavCard title="AI Insights" description="Deep portfolio insights" onClick={() => navigate('/ai/insights')} />
        <NavCard title="Risk Analysis" description="Detailed risk breakdown" onClick={() => navigate('/ai/risk-analysis')} />
        <NavCard title="Recommendations" description="AI-powered recommendations" onClick={() => navigate('/ai/recommendations')} />
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof TrendingUp; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function NavCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center justify-between rounded-xl border border-border bg-card/40 p-4 text-left transition-colors hover:border-primary/30 hover:bg-accent/40">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </button>
  );
}
