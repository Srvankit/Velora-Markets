import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, TrendingUp, Shield, Target, Linkedin, Github, Globe, Pencil, BadgeCheck, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { AchievementCard, BadgeCard } from '@/components/user/AchievementCard';
import { userProfile, portfolioQuickStats, investmentProfileStats } from '@/data/profile';
import { achievements, badges } from '@/data/achievements';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof TrendingUp> = { TrendingUp, Shield, Target, DollarSign };

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden p-0">
          {/* Cover Banner */}
          <div className="h-32 w-full" style={{ background: userProfile.coverColor }} />
          <div className="px-5 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                {/* Avatar */}
                <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
                  {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="sm:pb-2">
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-display text-xl font-bold tracking-tight">{userProfile.fullName}</h1>
                    {userProfile.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{userProfile.username}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{userProfile.city}, {userProfile.country}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {formatDate(userProfile.joinedDate, { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 sm:mb-2" onClick={() => navigate('/settings')}>
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {portfolioQuickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="p-4 transition-shadow hover:shadow-card-hover">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-display text-lg font-bold tabular-nums">{stat.value}</p>
              {stat.change && (
                <p className={cn('text-xs font-medium', stat.positive ? 'text-success' : 'text-danger')}>{stat.change}</p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Personal Information */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">Personal Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem icon={Briefcase} label="Occupation" value={userProfile.occupation} />
              <InfoItem icon={MapPin} label="Location" value={`${userProfile.city}, ${userProfile.country}`} />
              <InfoItem icon={Clock} label="Timezone" value={userProfile.timezone} />
              <InfoItem icon={DollarSign} label="Currency" value={userProfile.currency} />
            </div>
          </Card>

          {/* Investment Profile */}
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">Investment Profile</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {investmentProfileStats.map((stat) => {
                const Icon = iconMap[stat.icon] ?? TrendingUp;
                return (
                  <div key={stat.label} className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-sm font-semibold">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Bio & Social Links */}
          <Card className="p-5">
            <h3 className="mb-3 font-display text-base font-semibold">Bio</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{userProfile.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {userProfile.socialLinks.linkedin && (
                <a href={`https://${userProfile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Linkedin className="h-3.5 w-3.5" /> {userProfile.socialLinks.linkedin}
                </a>
              )}
              {userProfile.socialLinks.github && (
                <a href={`https://${userProfile.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Github className="h-3.5 w-3.5" /> {userProfile.socialLinks.github}
                </a>
              )}
              {userProfile.socialLinks.website && (
                <a href={`https://${userProfile.socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Globe className="h-3.5 w-3.5" /> {userProfile.socialLinks.website}
                </a>
              )}
            </div>
          </Card>

          {/* Achievements */}
          <section>
            <h3 className="mb-3 font-display text-base font-semibold">Achievements</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {achievements.map((ach, i) => (
                <AchievementCard key={ach.id} achievement={ach} delay={i * 0.05} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Badges */}
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} delay={i * 0.05} />
              ))}
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{userProfile.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{userProfile.phone}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
