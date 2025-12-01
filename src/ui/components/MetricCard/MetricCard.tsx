import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  icon: React.ReactNode;
  value: string;
  title: string;
}

export default function MetricCard({ icon, title, value }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
