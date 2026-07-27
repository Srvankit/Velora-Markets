import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, FileText, FileDown, Archive, UserCog } from 'lucide-react';

interface ExportCardProps {
  title: string;
  description: string;
  icon: typeof Download;
  actions: { label: string; icon: typeof Download; variant?: 'default' | 'outline' | 'destructive' }[];
  delay?: number;
}

export function ExportCard({ title, description, icon: Icon, actions, delay = 0 }: ExportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card className="p-5 transition-shadow hover:shadow-card-hover">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button key={action.label} variant={action.variant ?? 'outline'} size="sm" className="gap-1.5">
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </Button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export function ExportGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ExportCard
        title="Export Profile"
        description="Download your profile information as PDF"
        icon={UserCog}
        actions={[
          { label: 'Export PDF', icon: FileText },
          { label: 'Share', icon: Share2 },
        ]}
        delay={0}
      />
      <ExportCard
        title="Download Settings"
        description="Export your preferences and settings configuration"
        icon={Download}
        actions={[
          { label: 'Download JSON', icon: FileDown },
          { label: 'Share', icon: Share2 },
        ]}
        delay={0.05}
      />
      <ExportCard
        title="Export Activity"
        description="Download your complete activity log"
        icon={Archive}
        actions={[
          { label: 'Export CSV', icon: FileDown },
          { label: 'Export PDF', icon: FileText },
        ]}
        delay={0.1}
      />
      <ExportCard
        title="Generate Report"
        description="Create a comprehensive account report"
        icon={FileText}
        actions={[
          { label: 'Generate PDF', icon: FileText },
        ]}
        delay={0.15}
      />
    </div>
  );
}
