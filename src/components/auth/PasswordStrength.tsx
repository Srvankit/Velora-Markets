import { motion } from 'framer-motion';
import { scorePassword } from '@/lib/auth-schemas';
import { PASSWORD_STRENGTH_LEVELS } from '@/constants';
import { cn } from '@/lib/utils';

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password);
  const level = PASSWORD_STRENGTH_LEVELS[score as keyof typeof PASSWORD_STRENGTH_LEVELS];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
            initial={false}
          >
            <motion.div
              className={cn('h-full rounded-full', i <= score ? level.color : 'bg-transparent')}
              initial={{ width: 0 }}
              animate={{ width: i <= score ? '100%' : '0%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.div>
        ))}
      </div>
      {password && (
        <p className={cn('text-xs font-medium', level.textColor)}>
          {level.label}
        </p>
      )}
    </div>
  );
}
