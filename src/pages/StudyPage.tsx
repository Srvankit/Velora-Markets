import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Sparkles,
  PlayCircle,
  Coins,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Check,
  HelpCircle,
  AlertCircle,
  History,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ACADEMY_COURSES,
  ACADEMY_CATEGORIES,
  type AcademyCourse,
  type AcademyLesson,
  type CourseQuiz,
  type QuizQuestion,
} from '@/data/academyLessons';
import {
  backendApi,
  type BackendAcademyOverview,
  type BackendBadgeResponse,
  type BackendRedemptionResponse,
  type BackendRewardHistoryItem,
} from '@/services/backend';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency, getCurrencySymbol } from '@/lib/currency';
import { cn } from '@/lib/utils';

export default function StudyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userCurrency = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(userCurrency);

  // Active Category & Selection State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);

  // Backend Overview & Gamification State
  const [overview, setOverview] = useState<BackendAcademyOverview | null>(null);
  const [rewardHistory, setRewardHistory] = useState<BackendRewardHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<CourseQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  // Redemption Modal State
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [redeemCoinsInput, setRedeemCoinsInput] = useState('500');
  const [payoutMethod, setPayoutMethod] = useState('UPI ID');
  const [payoutDestination, setPayoutDestination] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<BackendRedemptionResponse | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'coins' | 'badge' } | null>(null);

  async function loadOverview() {
    try {
      setLoading(true);
      const data = await backendApi.academyOverview();
      setOverview(data);
    } catch (err) {
      console.error('Failed to load Academy overview:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  // Filter courses by category
  const filteredCourses = useMemo(() => {
    if (activeCategory === 'all') return ACADEMY_COURSES;
    return ACADEMY_COURSES.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  // Overall Total Progress
  const totalLessonsCount = useMemo(() => {
    return ACADEMY_COURSES.reduce((acc, c) => acc + c.lessons.length, 0);
  }, []);

  const completedCount = overview?.completedLessonIds.length ?? 0;
  const overallProgressPct = Math.min(Math.round((completedCount / (totalLessonsCount || 1)) * 100), 100);

  // Continue Learning recommendation
  const continueLesson = useMemo(() => {
    const completedSet = new Set(overview?.completedLessonIds ?? []);
    for (const course of ACADEMY_COURSES) {
      for (const lesson of course.lessons) {
        if (!completedSet.has(lesson.id)) {
          return { course, lesson };
        }
      }
    }
    return null;
  }, [overview]);

  // Complete a Lesson Handler
  async function handleCompleteLesson(lesson: AcademyLesson) {
    try {
      const updated = await backendApi.completeLesson({
        lessonId: lesson.id,
        courseId: lesson.courseId,
      });
      setOverview(updated);
      setToastMessage({
        title: '+50 Velora Coins Earned!',
        desc: `Completed "${lesson.title}". Keep compounding your knowledge.`,
        type: 'coins',
      });
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  }

  // Open Quiz Modal
  function startQuiz(quiz: CourseQuiz) {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizPassed(false);
    setQuizModalOpen(true);
  }

  // Submit Quiz Handler
  async function handleQuizSubmit() {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / activeQuiz.questions.length) * 100);
    const passed = calculatedScore >= activeQuiz.passingScore;

    setQuizScore(calculatedScore);
    setQuizPassed(passed);
    setQuizSubmitted(true);

    try {
      const result = await backendApi.submitQuiz({
        quizId: activeQuiz.id,
        courseId: selectedCourse?.id || 'fundamentals',
        score: calculatedScore,
        passed,
      });

      if (passed && result.coinsAwarded > 0) {
        setToastMessage({
          title: `+${result.coinsAwarded} Coins Awarded!`,
          desc: `Scored ${calculatedScore}% on "${activeQuiz.title}".`,
          type: 'coins',
        });
        setTimeout(() => setToastMessage(null), 5000);
      }

      if (result.newBadges && result.newBadges.length > 0) {
        setTimeout(() => {
          setToastMessage({
            title: `🏆 Badge Unlocked: ${result.newBadges[0].badgeName}`,
            desc: result.newBadges[0].description,
            type: 'badge',
          });
          setTimeout(() => setToastMessage(null), 6000);
        }, 1500);
      }

      // Refresh overview
      void loadOverview();
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  }

  // Coin Redemption Handler
  async function handleRedeemSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRedeemError(null);
    setRedeemSuccess(null);
    setRedeemLoading(true);

    const coinsToRedeem = parseInt(redeemCoinsInput, 10);
    if (isNaN(coinsToRedeem) || coinsToRedeem < 10) {
      setRedeemError('Minimum redemption amount is 10 coins.');
      setRedeemLoading(false);
      return;
    }

    try {
      const response = await backendApi.redeemCoins({
        coins: coinsToRedeem,
        payoutMethod,
        payoutDestination: payoutDestination || 'Primary User Account',
        notes: `Redeemed ${coinsToRedeem} coins for ${userCurrency}`,
      });
      setRedeemSuccess(response);
      void loadOverview();
    } catch (err: unknown) {
      setRedeemError(err instanceof Error ? err.message : 'Unable to submit redemption request.');
    } finally {
      setRedeemLoading(false);
    }
  }

  // Open History modal
  async function openHistory() {
    try {
      const list = await backendApi.rewardHistory();
      setRewardHistory(list);
      setHistoryModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch reward history:', err);
    }
  }

  // Convert coins to currency equivalent
  const coinBalance = overview?.coinsBalance ?? 100;
  const rupeeEquivalent = (coinBalance / 10).toFixed(2);

  return (
    <div className="space-y-6">
      {/* TOAST ALERT */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-primary/40 bg-card/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              {toastMessage.type === 'coins' ? <Coins className="h-5 w-5 text-warning" /> : <Award className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <p className="font-display text-sm font-bold text-foreground">{toastMessage.title}</p>
              <p className="text-xs text-muted-foreground">{toastMessage.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO BANNER & GAMIFICATION REWARD CARDS */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Hero */}
        <div className="relative col-span-2 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-background p-6 shadow-glow-sm sm:p-8">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Velora Markets Academy</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Virtual Trading & Investment Mastery
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Bridge theory and execution. Learn candlestick mechanics, technical indicators, fundamental valuation, and portfolio risk management. Earn Velora Coins as you level up.
            </p>

            {continueLesson && (
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setSelectedCourse(continueLesson.course);
                    setSelectedLesson(continueLesson.lesson);
                  }}
                  className="gap-2 shadow-glow-sm"
                >
                  <PlayCircle className="h-4 w-4" />
                  Continue Learning: {continueLesson.lesson.title}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Gamification Coins & Rewards Card */}
        <Card className="flex flex-col justify-between border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Velora Coins</span>
              <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning font-mono text-xs">
                10 Coins = ₹1
              </Badge>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <Coins className="h-7 w-7 text-warning animate-bounce" />
              <span className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl tabular-nums">
                {coinBalance.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-muted-foreground">coins</span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Equivalent Value: <strong className="text-foreground">{formatCurrency(parseFloat(rupeeEquivalent), userCurrency)}</strong>
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setRedeemSuccess(null);
                setRedeemError(null);
                setRedeemModalOpen(true);
              }}
              className="flex-1 gap-1.5 shadow-glow-sm"
            >
              <Coins className="h-3.5 w-3.5" />
              Redeem Coins
            </Button>
            <Button variant="outline" size="sm" onClick={openHistory} className="gap-1 text-xs">
              <History className="h-3.5 w-3.5" />
              Ledger
            </Button>
          </div>
        </Card>
      </div>

      {/* CURRICULUM PROGRESS & BADGES ROW */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Course Completion</p>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums">
            {completedCount} / {totalLessonsCount}
          </p>
          <Progress value={overallProgressPct} className="mt-3 h-1.5" />
          <p className="mt-1.5 text-[11px] text-muted-foreground">{overallProgressPct}% of curriculum completed</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Unlocked Badges</p>
            <Award className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums">{overview?.badges.length ?? 0} Badges</p>
          <div className="mt-3 flex items-center gap-1.5">
            {overview?.badges.slice(0, 3).map((b) => (
              <span key={b.badgeCode} className="rounded-md bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning" title={b.description}>
                {b.badgeName}
              </span>
            ))}
            {(overview?.badges.length ?? 0) === 0 && <span className="text-[11px] text-muted-foreground">Complete lessons to earn</span>}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Quiz Mastery</p>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums">
            {Object.keys(overview?.quizScores ?? {}).length} Quizzes Passed
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground">100 Coins per module quiz passed</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Trader Rank</p>
            <ShieldCheck className="h-4 w-4 text-success" />
          </div>
          <p className="mt-1 font-display text-xl font-bold">
            {overallProgressPct === 100 ? 'Certified Master' : overallProgressPct >= 50 ? 'Senior Scholar' : 'Junior Apprentice'}
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground">Tier based on verified completion</p>
        </Card>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {ACADEMY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {cat.title} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* COURSE CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, idx) => {
          const completedCourseLessons = course.lessons.filter((l) => overview?.completedLessonIds.includes(l.id)).length;
          const courseProgress = Math.round((completedCourseLessons / course.lessons.length) * 100);
          const isQuizPassed = Boolean(overview?.quizScores && overview.quizScores[course.quiz.id]);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
            >
              <Card className="flex h-full flex-col justify-between overflow-hidden border-border/80 transition-all duration-200 hover:border-primary/50 hover:shadow-glow-xs">
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold"
                      style={{ backgroundColor: course.color }}
                    >
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="border-border/60 bg-muted/30 text-[11px]">
                      {course.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{course.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{courseProgress}%</span>
                    </div>
                    <Progress value={courseProgress} className="h-1.5" />
                  </div>

                  {/* Lessons list preview */}
                  <div className="space-y-1.5 pt-2">
                    {course.lessons.map((lesson) => {
                      const isCompleted = overview?.completedLessonIds.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            setSelectedCourse(course);
                            setSelectedLesson(lesson);
                          }}
                          className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                            ) : (
                              <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-muted-foreground/40" />
                            )}
                            <span className={cn('truncate', isCompleted && 'text-muted-foreground line-through')}>{lesson.title}</span>
                          </div>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{lesson.readTime}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-border/60 bg-muted/20 p-4 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedLesson(course.lessons[0]);
                    }}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    Start Course <ChevronRight className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      startQuiz(course.quiz);
                    }}
                    className={cn('gap-1.5 text-xs', isQuizPassed ? 'text-success' : 'text-primary')}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isQuizPassed ? 'Quiz Passed' : 'Take Quiz'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* LESSON READER DIALOG */}
      <Dialog
        open={Boolean(selectedLesson)}
        onOpenChange={(open) => {
          if (!open) setSelectedLesson(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          {selectedLesson && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <GraduationCap className="h-4 w-4" />
                  <span>{selectedCourse?.title}</span>
                  <span>·</span>
                  <span className="text-muted-foreground">{selectedLesson.readTime}</span>
                </div>
                <DialogTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {selectedLesson.title}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-muted-foreground">
                  {selectedLesson.subtitle}
                </DialogDescription>
              </DialogHeader>

              {/* Optional Embedded YouTube Learning Video */}
              {selectedLesson.videoUrl && (
                <div className="overflow-hidden rounded-xl border border-border/80 bg-black aspect-video shadow-md">
                  <iframe
                    src={selectedLesson.videoUrl}
                    title={selectedLesson.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Summary Callout */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs sm:text-sm text-foreground leading-relaxed">
                <strong>Executive Summary:</strong> {selectedLesson.summary}
              </div>

              {/* Lesson In-Depth Content */}
              <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
                {selectedLesson.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Formulas or Metrics Box */}
              {selectedLesson.formulasOrMetrics && selectedLesson.formulasOrMetrics.length > 0 && (
                <div className="space-y-2 rounded-xl border border-border/80 bg-muted/30 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Formulas & Key Rules</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedLesson.formulasOrMetrics.map((f, i) => (
                      <div key={i} className="rounded-lg border border-border/60 bg-card p-3">
                        <p className="text-xs font-semibold text-primary">{f.label}</p>
                        <p className="mt-1 font-mono text-xs font-bold text-foreground">{f.formula}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{f.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="space-y-2 rounded-xl border border-success/30 bg-success/5 p-4">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-success">
                  <Check className="h-4 w-4" /> Core Takeaways
                </p>
                <ul className="space-y-1.5 pl-4 text-xs sm:text-sm text-foreground">
                  {selectedLesson.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="list-disc leading-relaxed">
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                {selectedLesson.veloraToolAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLesson(null);
                      navigate(selectedLesson.veloraToolAction!.href);
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    {selectedLesson.veloraToolAction.label}
                  </Button>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      void handleCompleteLesson(selectedLesson);
                    }}
                    className={cn(
                      'gap-1.5 shadow-glow-sm',
                      overview?.completedLessonIds.includes(selectedLesson.id) && 'bg-success hover:bg-success',
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {overview?.completedLessonIds.includes(selectedLesson.id)
                      ? 'Lesson Completed (+50 Coins)'
                      : 'Complete Lesson & Earn 50 Coins'}
                  </Button>

                  {selectedCourse?.quiz && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const q = selectedCourse.quiz;
                        setSelectedLesson(null);
                        startQuiz(q);
                      }}
                      className="gap-1 text-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-warning" />
                      Take Quiz
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* INTERACTIVE MCQ QUIZ MODAL */}
      <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
          {activeQuiz && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-semibold text-warning">
                  <Sparkles className="h-4 w-4" />
                  <span>Module Knowledge Assessment (+{activeQuiz.coinReward} Coins)</span>
                </div>
                <DialogTitle className="font-display text-xl font-bold">{activeQuiz.title}</DialogTitle>
                <DialogDescription>
                  Passing score: {activeQuiz.passingScore}%. Select one answer for each question below.
                </DialogDescription>
              </DialogHeader>

              {/* Questions List */}
              <div className="space-y-6 pt-2">
                {activeQuiz.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
                    <p className="font-semibold text-sm text-foreground">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        const isWrongSelection = quizSubmitted && isSelected && !isCorrect;

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => {
                              setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                            }}
                            className={cn(
                              'flex w-full items-center justify-between rounded-lg border p-3 text-left text-xs transition-colors',
                              isSelected ? 'border-primary bg-primary/10 font-semibold text-primary' : 'border-border/60 hover:bg-muted/60',
                              quizSubmitted && isCorrect && 'border-success bg-success/15 font-bold text-success',
                              quizSubmitted && isWrongSelection && 'border-danger bg-danger/15 text-danger line-through',
                            )}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <Check className="h-4 w-4 text-success shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="rounded-lg border border-border/60 bg-card p-3 text-xs text-muted-foreground">
                        <strong className="text-foreground">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quiz Submission Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                {quizSubmitted ? (
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'rounded-lg px-3 py-1 font-display text-sm font-bold',
                        quizPassed ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger',
                      )}
                    >
                      {quizPassed ? `Passed: ${quizScore}% 🎉` : `Failed: ${quizScore}% (Needs ${activeQuiz.passingScore}%)`}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="gap-1 text-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Answered {Object.keys(quizAnswers).length} of {activeQuiz.questions.length} questions
                  </div>
                )}

                {!quizSubmitted && (
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                    className="ml-auto shadow-glow-sm"
                  >
                    Submit Answers & Calculate Score
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* COIN REDEMPTION MODAL */}
      <Dialog open={redeemModalOpen} onOpenChange={setRedeemModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-semibold text-warning">
              <Coins className="h-4 w-4" />
              <span>Velora Coin Redemption (10 Coins = ₹1)</span>
            </div>
            <DialogTitle className="font-display text-lg font-bold">Redeem Academy Reward Coins</DialogTitle>
            <DialogDescription>
              Convert earned coins into your base currency equivalent. Requests are recorded to your audit ledger.
            </DialogDescription>
          </DialogHeader>

          {redeemSuccess ? (
            <div className="space-y-4 py-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-7 w-7" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-foreground">Redemption Queued Successfully</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your request to redeem <strong>{redeemSuccess.coinsRedeemed} coins</strong> for{' '}
                  <strong>{formatCurrency(redeemSuccess.currencyAmount, redeemSuccess.currency)}</strong> has been recorded.
                </p>
              </div>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-left text-xs text-warning">
                <strong>Payout Status: PENDING_PAYOUT</strong>
                <p className="mt-0.5 text-muted-foreground">
                  Per compliance policy, payouts require bank verification and settlement clearance. No fake transactions are simulated.
                </p>
              </div>
              <Button onClick={() => setRedeemModalOpen(false)} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRedeemSubmit} className="space-y-4 pt-2">
              {redeemError && (
                <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{redeemError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs">Coins to Redeem</Label>
                <Input
                  type="number"
                  min="10"
                  max={coinBalance}
                  value={redeemCoinsInput}
                  onChange={(e) => setRedeemCoinsInput(e.target.value)}
                  className="h-9 font-mono"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>Available: {coinBalance} coins</span>
                  <span>
                    Equivalent: <strong>{formatCurrency((parseInt(redeemCoinsInput || '0', 10) / 10), userCurrency)}</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Payout Method</Label>
                <Tabs value={payoutMethod} onValueChange={setPayoutMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="UPI ID">UPI ID</TabsTrigger>
                    <TabsTrigger value="Bank Transfer">Bank Transfer (IMPS)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">
                  {payoutMethod === 'UPI ID' ? 'UPI Virtual Payment Address' : 'Bank Account & IFSC'}
                </Label>
                <Input
                  placeholder={payoutMethod === 'UPI ID' ? 'name@okhdfcbank' : 'Account Number & IFSC Code'}
                  value={payoutDestination}
                  onChange={(e) => setPayoutDestination(e.target.value)}
                  className="h-9"
                  required
                />
              </div>

              <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-[11px] text-muted-foreground">
                <ShieldCheck className="inline h-3.5 w-3.5 text-primary mr-1" />
                Ledger-backed server transactions. Payout status will remain in pending queue until approved.
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setRedeemModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={redeemLoading || coinBalance < 10} className="flex-1 shadow-glow-sm">
                  {redeemLoading ? 'Submitting…' : 'Confirm Redemption'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* REWARD LEDGER HISTORY MODAL */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
              <History className="h-5 w-5 text-primary" />
              Velora Coin Reward History
            </DialogTitle>
            <DialogDescription>
              Chronological ledger of all coins earned through learning milestones and redemptions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 pt-3">
            {rewardHistory.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">No reward transactions recorded yet.</p>
            ) : (
              rewardHistory.map((item) => {
                const isPositive = item.amount >= 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.description}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn('font-mono font-bold', isPositive ? 'text-success' : 'text-danger')}>
                        {isPositive ? '+' : ''}
                        {item.amount} coins
                      </span>
                      <p className="text-[10px] text-muted-foreground">Bal: {item.balanceAfter}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
