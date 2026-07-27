import { motion } from 'framer-motion';
import { Building2, Calendar, User, MapPin, Users, Globe, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { CompanyProfile } from '@/data/companyProfiles';

interface CompanyOverviewProps {
  profile: CompanyProfile;
}

export function CompanyOverview({ profile }: CompanyOverviewProps) {
  const details = [
    { icon: Calendar, label: 'Founded', value: profile.founded },
    { icon: User, label: 'CEO', value: profile.ceo },
    { icon: MapPin, label: 'Headquarters', value: profile.headquarters },
    { icon: Users, label: 'Employees', value: profile.employees },
    { icon: Building2, label: 'Industry', value: profile.industry },
    { icon: Globe, label: 'Website', value: profile.website },
  ];

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="font-display text-base font-semibold">Company Profile</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">About</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{profile.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Business Summary</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{profile.businessSummary}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3">
        {details.map((detail, i) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <detail.icon className="h-3.5 w-3.5" />
              {detail.label}
            </div>
            <p className="text-sm font-medium">{detail.value}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
