import { getSettings } from "@/actions/settings";
import SettingsForm from "@/components/dashboard/settings-form";

export const revalidate = 0;

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-primary">System Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage general resort information, tax rates, and system preferences.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
