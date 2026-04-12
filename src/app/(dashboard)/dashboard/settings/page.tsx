import { getUser } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-heading text-neutral-900">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account */}
      <section className="border border-dashed border-neutral-200">
        <div className="px-4 py-3 border-b border-dashed border-neutral-200">
          <h2 className="font-semibold text-neutral-800">Account</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Your profile information from OAuth sign-in.</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Name</Label>
            <Input
              defaultValue={user?.name ?? ""}
              disabled
              className="border-dashed bg-neutral-50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Email</Label>
            <Input
              defaultValue={user?.email ?? ""}
              disabled
              className="border-dashed bg-neutral-50"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Account details are managed through your OAuth provider (Google or Discord) and cannot be changed here.
          </p>
        </div>
      </section>

      {/* Cupping preferences */}
      <section className="border border-dashed border-neutral-200">
        <div className="px-4 py-3 border-b border-dashed border-neutral-200">
          <h2 className="font-semibold text-neutral-800">Cupping Preferences</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Defaults for new cupping sessions.</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Default number of cups per sample</Label>
            <Input
              type="number"
              defaultValue={5}
              disabled
              className="border-dashed bg-neutral-50 w-24"
            />
            <p className="text-xs text-muted-foreground">SCA standard is 5 cups. This value is fixed per the protocol.</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Score precision</Label>
            <Input
              defaultValue="0.25 increments"
              disabled
              className="border-dashed bg-neutral-50 w-40"
            />
            <p className="text-xs text-muted-foreground">SCA requires scores in 0.25 increments. Cannot be changed.</p>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="border border-dashed border-neutral-200">
        <div className="px-4 py-3 border-b border-dashed border-neutral-200">
          <h2 className="font-semibold text-neutral-800">Data</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Export or manage your cupping data.</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-800">Export all sessions</p>
              <p className="text-xs text-muted-foreground mt-0.5">Download all your cupping sessions as a CSV file.</p>
            </div>
            <Button variant="outline" size="sm" className="border-dashed shrink-0" disabled>
              Export CSV
            </Button>
          </div>
          <div className="border-t border-dashed border-neutral-200 pt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-red-700">Delete account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all associated cupping data. This cannot be undone.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-dashed border-red-200 text-red-600 hover:bg-red-50 shrink-0" disabled>
              Delete Account
            </Button>
          </div>
        </div>
      </section>

      {/* App info */}
      <div className="text-xs text-muted-foreground pt-2 space-y-1">
        <p>CupLog — SCA cup scoring, simplified.</p>
        <p>
          Questions or feedback?{" "}
          <a href="/feature-and-feedback" className="underline hover:text-foreground transition-colors">
            Send us a message.
          </a>
        </p>
      </div>
    </div>
  );
}
