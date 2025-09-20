import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function BotsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Bots">
        <Button>
          <PlusCircle />
          Add Bot
        </Button>
      </PageHeader>
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No bots configured yet.</p>
      </div>
    </div>
  );
}
