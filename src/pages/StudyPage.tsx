import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ACADEMY_CATEGORIES,
  ACADEMY_LESSONS,
  type AcademyLesson,
} from '@/data/academyLessons';
import { cn } from '@/lib/utils';

const STORAGE_KEY_STUDY = 'velora_completed_lessons';

export default function StudyPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STUDY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY_STUDY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const filteredLessons = ACADEMY_LESSONS.filter((lesson) => {
    if (activeCategory === 'all') return true;
    return lesson.category === activeCategory;
  });

  const progressPct = Math.round((completedIds.length / ACADEMY_LESSONS.length) * 100);

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-background p-6 shadow-glow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Velora Markets Academy</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Virtual Trading & Investment Mastery
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bridge the gap between theory and execution. Study professional trading frameworks, candlestick patterns, financial ratios, and risk management with connected interactive tools.
            </p>
          </div>

          {/* PROGRESS CARD */}
          <div className="flex shrink-0 flex-col rounded-xl border border-border/70 bg-card/80 p-4 shadow-xs backdrop-blur-md sm:w-72">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Progress
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {completedIds.length} / {ACADEMY_LESSONS.length} Lessons ({progressPct}%)
              </span>
            </div>
            <Progress value={progressPct} className="h-2" />
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Award className="h-3.5 w-3.5 text-warning" />
                {progressPct === 100 ? 'Velora Certified Trader' : 'Scholar Tier'}
              </span>
              {completedIds.length > 0 && (
                <button
                  onClick={() => {
                    setCompletedIds([]);
                    localStorage.removeItem(STORAGE_KEY_STUDY);
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-[11px]"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-3">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
          className="rounded-full text-xs font-medium"
        >
          All Topics ({ACADEMY_LESSONS.length})
        </Button>

        {ACADEMY_CATEGORIES.map((cat) => {
          const count = ACADEMY_LESSONS.filter((l) => l.category === cat.id).length;
          const completedCount = ACADEMY_LESSONS.filter(
            (l) => l.category === cat.id && completedIds.includes(l.id),
          ).length;

          return (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className="rounded-full text-xs font-medium gap-1.5"
            >
              <span>{cat.title}</span>
              <span className="text-[10px] opacity-75 font-mono">
                ({completedCount}/{count})
              </span>
            </Button>
          );
        })}
      </div>

      {/* LESSONS GRID & ACTIVE LESSON DRAWER */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
        {/* LESSONS LIST */}
        <div className="space-y-3">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedIds.includes(lesson.id);
            const isSelected = selectedLesson?.id === lesson.id;

            return (
              <Card
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={cn(
                  'cursor-pointer p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-card-hover',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-glow-sm'
                    : 'bg-card/60 hover:bg-card',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                        {lesson.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lesson.readTime}
                      </span>
                    </div>

                    <h3 className="font-display text-sm font-semibold tracking-tight text-foreground truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lesson.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(lesson.id);
                    }}
                    className={cn(
                      'shrink-0 p-1 rounded-full transition-colors',
                      isCompleted ? 'text-success' : 'text-muted-foreground/40 hover:text-muted-foreground',
                    )}
                    title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    <CheckCircle2 className={cn('h-5 w-5', isCompleted && 'fill-success/20')} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* LESSON READER PANE */}
        <div className="lg:sticky lg:top-24 self-start">
          {selectedLesson ? (
            <Card className="overflow-hidden border border-border/80 bg-card p-6 shadow-card">
              <div className="space-y-6">
                {/* Lesson Header */}
                <div className="space-y-2 border-b border-border pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs uppercase font-mono">
                      {selectedLesson.category} · {selectedLesson.readTime}
                    </Badge>
                    <Button
                      variant={completedIds.includes(selectedLesson.id) ? 'secondary' : 'default'}
                      size="sm"
                      onClick={() => toggleComplete(selectedLesson.id)}
                      className="gap-1.5 text-xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {completedIds.includes(selectedLesson.id) ? 'Completed' : 'Mark as Complete'}
                    </Button>
                  </div>

                  <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-xs font-medium text-muted-foreground">
                    {selectedLesson.subtitle}
                  </p>
                </div>

                {/* Lesson Body Paragraphs */}
                <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
                  {selectedLesson.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Key Takeaways Card */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Key Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-xs text-foreground/85">
                    {selectedLesson.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connected Tool Action */}
                {selectedLesson.veloraToolAction && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">Practice in Velora</p>
                      <p className="text-[11px] text-muted-foreground">
                        Put this lesson into action with real market instruments.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(selectedLesson.veloraToolAction!.href)}
                      className="gap-1 text-xs"
                    >
                      <span>{selectedLesson.veloraToolAction.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-border bg-card/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">
                Select a lesson to begin studying
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Choose any topic from Market Essentials, Trading Risk, Technical Indicators, or Valuation on the left.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
