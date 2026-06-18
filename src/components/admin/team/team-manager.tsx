"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Search, ShieldCheck, UserPlus, UserX } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Field, inputClass, labelClass } from "@/components/admin/ui/form";
import { Modal, ConfirmDialog } from "@/components/admin/ui/modal";
import {
  type AdminRole,
  type TeamMember,
  ROLES,
  ROLE_BADGE,
  PERMISSION_GROUPS,
  roleDefaults,
  teamKeys,
  fetchTeam,
  inviteMember,
  updateMember,
  deactivateMember,
} from "@/lib/admin/team-client";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function TeamManager({
  currentUserId,
  canManage,
}: {
  currentUserId: string;
  canManage: boolean;
}) {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<TeamMember | null>(null);
  const [tempPassword, setTempPassword] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: teamKeys.list(debouncedSearch),
    queryFn: () => fetchTeam(debouncedSearch),
  });

  const members = data?.data ?? [];
  const invalidate = () => qc.invalidateQueries({ queryKey: teamKeys.all });

  const inviteMutation = useMutation({
    mutationFn: inviteMember,
    onSuccess: (res) => {
      toast.success("Member invited");
      setInviteOpen(false);
      if (res.tempPassword) {
        setTempPassword({ email: res.user.email, password: res.tempPassword });
      }
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: {
      id: string;
      patch: { name?: string; role?: AdminRole; permissions?: string[]; isActive?: boolean };
    }) => updateMember(vars.id, vars.patch),
    onSuccess: () => {
      toast.success("Member updated");
      setEditTarget(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateMember(id),
    onSuccess: () => {
      toast.success("Member deactivated");
      setDeactivateTarget(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Team &amp; Roles</h1>
          <p className="text-sm text-muted-foreground">
            Invite teammates and control what each role can access.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" /> Invite member
          </button>
        )}
      </header>

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Member</th>
              <th className="px-4 py-2.5">Role</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Last login</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isPending ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading team…
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5}>
                  <div className="py-16 text-center text-sm text-rose-400">
                    {(error as Error).message}
                  </div>
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="transition hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {initials(m.name)}
                      </span>
                      <div>
                        <div className="font-medium text-foreground">
                          {m.name}
                          {m.id === currentUserId && (
                            <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded px-1.5 py-0.5 text-xs font-medium", ROLE_BADGE[m.role])}>
                      {ROLES.find((r) => r.value === m.role)?.label ?? m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium",
                        m.isActive ? "text-emerald-400" : "text-zinc-500",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          m.isActive ? "bg-emerald-400" : "bg-zinc-500",
                        )}
                      />
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{timeAgo(m.lastLogin)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {canManage ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditTarget(m)}
                            className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs text-foreground transition hover:bg-accent"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          {m.isActive && m.id !== currentUserId && (
                            <button
                              type="button"
                              onClick={() => setDeactivateTarget(m)}
                              className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs text-rose-400 transition hover:bg-rose-500/10"
                            >
                              <UserX className="h-3.5 w-3.5" /> Deactivate
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">View only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invite */}
      {inviteOpen && (
        <MemberForm
          mode="invite"
          saving={inviteMutation.isPending}
          onClose={() => setInviteOpen(false)}
          onSubmit={(vals) =>
            inviteMutation.mutate({
              name: vals.name,
              email: vals.email,
              role: vals.role,
              permissions: vals.permissions,
              password: vals.password || undefined,
            })
          }
        />
      )}

      {/* Edit */}
      {editTarget && (
        <MemberForm
          mode="edit"
          member={editTarget}
          saving={updateMutation.isPending}
          onClose={() => setEditTarget(null)}
          onSubmit={(vals) =>
            updateMutation.mutate({
              id: editTarget.id,
              patch: {
                name: vals.name,
                role: vals.role,
                permissions: vals.permissions,
                isActive: vals.isActive,
              },
            })
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => deactivateTarget && deactivateMutation.mutate(deactivateTarget.id)}
        loading={deactivateMutation.isPending}
        title="Deactivate member?"
        message={`${deactivateTarget?.name} will lose access to the admin panel until reactivated.`}
        confirmLabel="Deactivate"
      />

      {/* Temp password reveal */}
      <Modal
        open={Boolean(tempPassword)}
        onClose={() => setTempPassword(null)}
        title="Temporary password"
        description="We couldn't send the invite email, so share these credentials securely."
        className="max-w-md"
      >
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="font-medium text-foreground">{tempPassword?.email}</span>
          </div>
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-foreground">
            {tempPassword?.password}
          </div>
          <p className="text-xs text-muted-foreground">
            Ask them to sign in and change it immediately.
          </p>
        </div>
      </Modal>
    </div>
  );
}

interface MemberFormValues {
  name: string;
  email: string;
  role: AdminRole;
  password: string;
  permissions: string[];
  isActive: boolean;
}

function MemberForm({
  mode,
  member,
  saving,
  onClose,
  onSubmit,
}: {
  mode: "invite" | "edit";
  member?: TeamMember;
  saving: boolean;
  onClose: () => void;
  onSubmit: (vals: MemberFormValues) => void;
}) {
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [role, setRole] = useState<AdminRole>(member?.role ?? "VIEWER");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(member?.isActive ?? true);
  // Extra grants beyond role defaults (user can toggle these on).
  const [extras, setExtras] = useState<Set<string>>(() => {
    const defaults = roleDefaults(member?.role ?? "VIEWER");
    const granted = new Set(member?.permissions ?? []);
    return new Set([...granted].filter((p) => !defaults.has(p)));
  });
  const [error, setError] = useState<string | null>(null);

  const defaults = useMemo(() => roleDefaults(role), [role]);

  function toggle(key: string) {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function submit() {
    if (name.trim().length < 2) return setError("Enter a name");
    if (mode === "invite" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return setError("Enter a valid email");
    if (mode === "invite" && password && password.length < 8)
      return setError("Password must be at least 8 characters");
    setError(null);
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      role,
      password,
      // Send the extra grants; the server unions them with role defaults.
      permissions: [...extras],
      isActive,
    });
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={mode === "invite" ? "Invite team member" : `Edit ${member?.name}`}
      className="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-9 rounded-md border border-border px-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "invite" ? "Send invite" : "Save changes"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <p className="rounded-md bg-rose-500/10 px-3 py-2 text-sm text-rose-400">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email" hint={mode === "edit" ? "Email can't be changed" : undefined}>
            <input
              className={inputClass}
              type="email"
              value={email}
              disabled={mode === "edit"}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Role">
            <select
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          {mode === "invite" ? (
            <Field label="Password" hint="Leave blank to email an invite">
              <input
                className={inputClass}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Optional"
              />
            </Field>
          ) : (
            <div>
              <label className={labelClass}>Account status</label>
              <label className="inline-flex h-10 items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Active
              </label>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {ROLES.find((r) => r.value === role)?.description}
        </p>

        {/* Permission matrix */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Permissions
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Permissions from the role are always granted (locked). Tick extra permissions to grant
            beyond the role.
          </p>
          <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-border p-3">
            {PERMISSION_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </div>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {group.permissions.map((p) => {
                    const fromRole = defaults.has(p.key);
                    const checked = fromRole || extras.has(p.key);
                    return (
                      <label
                        key={p.key}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1 text-sm",
                          fromRole ? "text-muted-foreground" : "text-foreground",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={fromRole}
                          onChange={() => toggle(p.key)}
                        />
                        {p.label}
                        {fromRole && (
                          <span className="ml-auto text-[10px] text-muted-foreground/70">role</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
