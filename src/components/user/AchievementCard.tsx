import { motion } from 'framer-motion';
import { Rocket, Hash, Trophy, DollarSign, Sparkles, Clock, Crown, PieChart, BadgeCheck, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Achievement, Badge as BadgeType } from '@/data/achievements';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Rocket> = {
  Rocket, Hash, Trophy, DollarSign, Sparkles, Clock, Crown, PieChart, BadgeCheck, TrendingUp,
};

interface AchievementCardProps {
  achievement: Achievement;
  delay?: number;
}

export function AchievementCard({ achievement, delay = 0 }: AchievementCardProps) {
  const Icon = iconMap[achievement.icon] ?? Trophy;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn(
        'relative overflow-hidden p-4 transition-shadow hover:shadow-card-hover',
        !achievement.unlocked && 'opacity-70',
      )}>
        {achievement.unlocked && (
          <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl" style={{ backgroundColor: achievement.color, opacity: 0.15 }} />
        )}
        <div className="relative flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : 'hsl(var(--muted))', color: achievement.unlocked ? achievement.color : 'hsl(var(--muted-foreground))' }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold">{achievement.title}</p>
              {achievement.unlocked && <Badge variant="outline" className="border-0 bg-success/10 text-[10px] text-success">Unlocked</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
            {achievement.unlocked ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            ) : achievement.progress !== undefined ? (
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 0.8, delay: delay + 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: achievement.color }}
                  />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{achievement.progress}% complete</p>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface BadgeCardProps {
  badge: BadgeType;
  delay?: number;
}

export function BadgeCard({ badge, delay = 0 }: BadgeCardProps) {
  const Icon = iconMap[badge.icon] ?? BadgeCheck;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2 }}
    >
      <Card className="flex flex-col items-center gap-2 p-4 text-center transition-shadow hover:shadow-card-hover">
        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `${badge.color}20`, color: badge.color }}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold">{badge.label}</p>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
        </div>
      </Card>
    </motion.div>
  );
}
