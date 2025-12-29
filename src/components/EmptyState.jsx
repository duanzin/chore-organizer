import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }) {
  return (
    <Card className="p-12 text-center bg-slate-50 border-dashed">
      <p className="text-lg text-muted-foreground mb-2">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </Card>
  );
}
