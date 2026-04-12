import { getUser } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <div className="max-w-lg px-6 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold font-heading text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Account</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Your profile from OAuth sign-in. Read-only.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-neutral-600">Name</Label>
            <Input
              defaultValue={user?.name ?? ""}
              disabled
              className="border-neutral-200 bg-neutral-50 text-neutral-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-neutral-600">Email</Label>
            <Input
              defaultValue={user?.email ?? ""}
              disabled
              className="border-neutral-200 bg-neutral-50 text-neutral-500"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-neutral-100" />

      {/* Cupping preferences */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Cupping Preferences</h2>
          <p className="text-xs text-neutral-400 mt-0.5">SCA protocol defaults — fixed per standard.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-neutral-600">Cups per sample</Label>
            <Input
              type="number"
              defaultValue={5}
              disabled
              className="border-neutral-200 bg-neutral-50 text-neutral-500 w-24"
            />
            <p className="text-xs text-neutral-400">SCA standard is 5 cups.</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-neutral-600">Score precision</Label>
            <Input
              defaultValue="0.25 increments"
              disabled
              className="border-neutral-200 bg-neutral-50 text-neutral-500 w-40"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-neutral-100" />

      {/* Data */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Data</h2>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm text-neutral-700">Export all sessions</p>
            <p className="text-xs text-neutral-400 mt-0.5">Download your cupping sessions as CSV.</p>
          </div>
          <Button variant="outline" size="sm" className="border-neutral-200 shrink-0 h-7 text-xs" disabled>
            Export CSV
          </Button>
        </div>
        <div className="flex items-start justify-between gap-6 pt-2">
          <div>
            <p className="text-sm text-red-600">Delete account</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Permanently delete your account and all data. Cannot be undone.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-100 text-red-500 hover:bg-red-50 shrink-0 h-7 text-xs"
            disabled
          >
            Delete
          </Button>
        </div>
      </section>

      <div className="border-t border-neutral-100 pt-4 text-xs text-neutral-400 space-y-1">
        <p>CupLog — SCA cup scoring, simplified.</p>
        <p>
          Questions?{" "}
          <a href="/feature-and-feedback" className="underline hover:text-neutral-600 transition-colors">
            Send feedback.
          </a>
        </p>
      </div>
    </div>
  );
}
