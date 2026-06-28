import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types';
import { STATUS_BADGE_VARIANT } from '@/lib/utils/helpers';

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const t = useTranslations('status');
  return <Badge variant={STATUS_BADGE_VARIANT[status]}>{t(status)}</Badge>;
}
