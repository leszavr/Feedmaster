
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" />
      <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Settings page is under construction.
        </p>
      </div>
    </div>
  );
}
