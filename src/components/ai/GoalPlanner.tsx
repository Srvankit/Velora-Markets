import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Car, Home, Plane, GraduationCap, PiggyBank, Plus, X, TrendingUp, ShieldCheck, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  riskLevel: 'low' | 'medium' | 'high';
  color: string;
}

const goalIcons: Record<string, typeof Target> = {
  Car, Home, Plane, GraduationCap, PiggyBank, Target,
};

const goalPresets = [
  { name: 'Buy a House', icon: 'Home', color: 'hsl(var(--chart-2))' },
  { name: 'Emergency Fund', icon: 'PiggyBank', color: 'hsl(var(--success))' },
  { name: 'Retirement', icon: 'PiggyBank', color: 'hsl(var(--chart-3))' },
  { name: 'Vacation', icon: 'Plane', color: 'hsl(var(--chart-4))' },
  { name: 'Dream Car', icon: 'Car', color: 'hsl(var(--chart-5))' },
  { name: 'Education', icon: 'GraduationCap', color: 'hsl(var(--primary))' },
];

const initialGoals: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', icon: 'PiggyBank', targetAmount: 50000, currentAmount: 32500, monthlyContribution: 1500, riskLevel: 'low', color: 'hsl(var(--success))' },
  { id: 'g2', name: 'Buy a House', icon: 'Home', targetAmount: 150000, currentAmount: 42300, monthlyContribution: 3500, riskLevel: 'medium', color: 'hsl(var(--chart-2))' },
  { id: 'g3', name: 'Retirement', icon: 'PiggyBank', targetAmount: 500000, currentAmount: 87500, monthlyContribution: 3000, riskLevel: 'medium', color: 'hsl(var(--chart-3))' },
  { id: 'g4', name: 'Vacation', icon: 'Plane', targetAmount: 12000, currentAmount: 7800, monthlyContribution: 800, riskLevel: 'low', color: 'hsl(var(--chart-4))' },
];

function getAIAnalysis(goal: Goal) {
  const remaining = goal.targetAmount - goal.currentAmount;
  const months = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : 0;
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const probability = Math.min(95, Math.max(60, 100 - months / 12));

  let estimatedCompletion = 'Achieved';
  if (months > 0) {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    estimatedCompletion = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  return {
    monthlySuggestion: Math.max(goal.monthlyContribution, Math.ceil(remaining / Math.max(months, 1))),
    estimatedCompletion,
    riskLevel: goal.riskLevel,
    probability: Math.round(probability),
    months,
  };
}

export function GoalPlanner() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', monthlyContribution: '', icon: 'Target', color: 'hsl(var(--primary))' });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;
    const goal: Goal = {
      id: `g-${Date.now()}`,
      name: newGoal.name,
      icon: newGoal.icon,
      targetAmount: parseFloat(newGoal.targetAmount) || 0,
      currentAmount: 0,
      monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0,
      riskLevel: 'medium',
      color: newGoal.color,
    };
    setGoals((prev) => [...prev, goal]);
    setShowAddModal(false);
    setNewGoal({ name: '', targetAmount: '', monthlyContribution: '', icon: 'Target', color: 'hsl(var(--primary))' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">AI Investment Goal Planner</h3>
        <Button size="sm" className="gap-1.5" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {goals.map((goal, i) => {
          const Icon = goalIcons[goal.icon] ?? Target;
          const analysis = getAIAnalysis(goal);
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="p-4 transition-shadow hover:shadow-card-hover">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ backgroundColor: goal.color }}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(goal.targetAmount, currency, { compact: true })} target</p>
                  </div>
                  <span className="rounded-lg px-2 py-1 text-xs font-bold" style={{ backgroundColor: `${goal.color}20`, color: goal.color }}>
                    {progress.toFixed(0)}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 + 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium tabular-nums">{formatCurrency(goal.currentAmount, currency, { compact: true })}</span>
                    <span className="text-muted-foreground">{formatCurrency(goal.targetAmount, currency, { compact: true })}</span>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="mt-3 space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="flex items-center gap-1 text-xs font-medium text-primary">
                    <TrendingUp className="h-3 w-3" />
                    AI Analysis
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Suggested Monthly</span>
                      <p className="font-semibold">{formatCurrency(analysis.monthlySuggestion, currency, { compact: true })}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Est. Completion</span>
                      <p className="font-semibold">{analysis.estimatedCompletion}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risk Level</span>
                      <p className={cn('font-semibold capitalize', analysis.riskLevel === 'low' ? 'text-success' : analysis.riskLevel === 'medium' ? 'text-warning' : 'text-danger')}>
                        {analysis.riskLevel}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Probability</span>
                      <p className="font-semibold text-success">{analysis.probability}%</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Investment Goal</DialogTitle>
            <DialogDescription>Set a new financial goal and get AI-powered recommendations.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Goal Name</Label>
              <Input value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} placeholder="e.g. Buy a House" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Choose Preset</Label>
              <div className="flex flex-wrap gap-2">
                {goalPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setNewGoal({ ...newGoal, name: preset.name, icon: preset.icon, color: preset.color })}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
                      newGoal.name === preset.name ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent',
                    )}
                  >
                    {(() => { const Icon = goalIcons[preset.icon] ?? Target; return <Icon className="h-3.5 w-3.5" />; })()}
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Target Amount</Label>
                <Input type="number" value={newGoal.targetAmount} onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })} placeholder="50000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Monthly Contribution</Label>
                <Input type="number" value={newGoal.monthlyContribution} onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: e.target.value })} placeholder="2000" />
              </div>
            </div>
            <Button className="w-full" onClick={handleAddGoal} disabled={!newGoal.name || !newGoal.targetAmount}>
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
