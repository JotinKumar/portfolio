import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "@/components/admin/settings-section";
import type { SocialLink, SocialPosition } from "@/lib/db-types";

const SOCIAL_POSITIONS: SocialPosition[] = ["FOOTER", "CONTACT"];

export function SocialSettingsTable({
  socialLinks,
  createAction,
  updateAction,
  deleteAction,
}: {
  socialLinks: SocialLink[];
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <SettingsSection
      title="Social Settings"
      description="Manage social links in one place. These rows are the source of truth for public footer and contact links."
      action={<Badge variant="outline">{socialLinks.length} links</Badge>}
    >
      <div className="space-y-6">
        <form action={createAction} className="grid gap-4 rounded-2xl border border-border/70 bg-muted/15 p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Create social link</h3>
          </div>
          <Input name="id" placeholder="Unique ID" required />
          <Input name="platform" placeholder="Platform" required />
          <Input name="label" placeholder="Label" required />
          <Input name="url" placeholder="URL" required />
          <select
            aria-label="social position"
            name="position"
            defaultValue="FOOTER"
            className="h-11 rounded-none border border-input bg-background px-3 text-sm"
          >
            {SOCIAL_POSITIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          <Input name="order" type="number" defaultValue={0} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visible" defaultChecked /> Visible
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Create Social Link</Button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-2xl border border-border/70">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/45 text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {socialLinks.map((item) => (
                <tr key={item.id} className="bg-background/70">
                  <td className="px-4 py-3">
                    <Input name="platform" form={`social-${item.id}`} defaultValue={item.platform} required />
                  </td>
                  <td className="px-4 py-3">
                    <Input name="label" form={`social-${item.id}`} defaultValue={item.label} required />
                  </td>
                  <td className="px-4 py-3">
                    <Input name="url" form={`social-${item.id}`} defaultValue={item.url} required />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label="social position"
                      name="position"
                      form={`social-${item.id}`}
                      defaultValue={item.position}
                      className="h-11 w-full rounded-none border border-input bg-background px-3 text-sm"
                    >
                      {SOCIAL_POSITIONS.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Input name="order" form={`social-${item.id}`} type="number" defaultValue={item.order} />
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2">
                      <input name="visible" form={`social-${item.id}`} type="checkbox" defaultChecked={item.visible} />
                      <span className="text-sm text-muted-foreground">Visible</span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form id={`social-${item.id}`} action={updateAction}>
                        <input type="hidden" name="id" value={item.id} />
                      </form>
                      <Button form={`social-${item.id}`} type="submit" size="sm" variant="outline">
                        Save
                      </Button>
                      <Button form={`social-delete-${item.id}`} type="submit" size="sm" variant="destructive">
                        Delete
                      </Button>
                      <form id={`social-delete-${item.id}`} action={deleteAction}>
                        <input type="hidden" name="id" value={item.id} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SettingsSection>
  );
}
