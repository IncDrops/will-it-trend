
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconSeparatorProps = {
  icon?: LucideIcon;
  icons?: LucideIcon[];
  className?: string;
};

export function IconSeparator({ icon: Icon, icons, className }: IconSeparatorProps) {
  return (
    <div className={cn("flex justify-center items-center gap-6 my-8 text-primary/30", className)}>
      {Icon && <Icon className="w-10 h-10" />}
      {icons && icons.map((I, index) => <I key={index} className="w-10 h-10" />)}
    </div>
  );
}
