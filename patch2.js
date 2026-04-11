const fs = require('fs');
const content = fs.readFileSync('/home/khaled/Coding-Projects/BookingFlow/frontend/src/app/b/[slug]/BookingWizard.tsx', 'utf8');

const newContent = content.replace(
  `'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'`,
  `'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR' | 'GUEST_FORM'`
).replace(
  `import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';`,
  `import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';`
);

fs.writeFileSync('/home/khaled/Coding-Projects/BookingFlow/frontend/src/app/b/[slug]/BookingWizard.tsx', newContent);
