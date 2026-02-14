'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfessionalMotivationCard() {
  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100">
          Professional Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">
          Elite rankers optimize systems, not motivation. Build repeatable execution loops.
        </p>
      </CardContent>
    </Card>
  );
}
