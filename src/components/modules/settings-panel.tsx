"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, HardDrive, Import, Info, Lock, Moon, Palette, Save, Settings, ShieldCheck, Sun, Trash2, Upload } from "lucide-react";
import { ModuleFrame } from "@/components/modules/module-frame";
import { OfflineStatus } from "@/components/shell/offline-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { bytesToHuman, getStorageDetails, parseImportedLifeData, serializeLifeData } from "@/lib/storage";
import { hashPin, isValidPin } from "@/lib/security";
import { useLifeStore } from "@/stores/life-store";
import type { Language, ThemeMode } from "@/types/life";

const themeModes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Settings }
];

const themeColors = ["#2563EB", "#F59E0B", "#22C55E", "#A855F7", "#EC4899", "#14B8A6", "#1E3A8A"];
const languages: { value: Language; label: string }[] = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "gujarati", label: "Gujarati" }
];

export function SettingsPanel() {
  const data = useLifeStore();
  const updateSettings = useLifeStore((state) => state.updateSettings);
  const replaceData = useLifeStore((state) => state.replaceData);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [storage, setStorage] = useState<{ usage: number; quota: number; cacheNames: string[] } | null>(null);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  const lifeData = useMemo(
    () => ({
      version: 1 as const,
      diaryPages: data.diaryPages,
      habits: data.habits,
      negativePoints: data.negativePoints,
      motivationFavorites: data.motivationFavorites,
      tasks: data.tasks,
      naamJapCounts: data.naamJapCounts,
      nameWriteCounts: data.nameWriteCounts,
      settings: data.settings
    }),
    [data.diaryPages, data.habits, data.motivationFavorites, data.naamJapCounts, data.nameWriteCounts, data.negativePoints, data.settings, data.tasks]
  );

  useEffect(() => {
    void getStorageDetails().then(setStorage);
  }, [data.diaryPages.length, data.habits.length, data.negativePoints.length, data.tasks.length]);

  const exportData = () => {
    const blob = new Blob([serializeLifeData(lifeData)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `life-changer-book-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    const text = await file.text();
    const parsed = parseImportedLifeData(text);
    await replaceData(parsed);
    setMessage("Backup restored on this device.");
  };

  const requestNotifications = async (checked: boolean) => {
    if (!checked) {
      updateSettings({ notifications: false });
      return;
    }
    if (!("Notification" in window)) {
      setMessage("Notifications are not supported in this browser.");
      return;
    }
    const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
    updateSettings({ notifications: permission === "granted" });
    setMessage(permission === "granted" ? "Notifications enabled locally." : "Notification permission was not granted.");
  };

  const savePin = async () => {
    if (!isValidPin(pin)) {
      setMessage("PIN must be 4 to 8 digits.");
      return;
    }
    updateSettings({ diaryPinHash: await hashPin(pin) });
    setPin("");
    setMessage("Diary PIN saved locally.");
  };

  const requestPersistentStorage = async () => {
    if (!navigator.storage?.persist) {
      setMessage("Persistent storage is not available in this browser.");
      return;
    }
    const persisted = await navigator.storage.persist();
    setMessage(persisted ? "Persistent storage granted." : "Browser kept standard storage mode.");
  };

  return (
    <ModuleFrame
      eyebrow="Local control"
      title="Settings"
      subtitle="Everything stays offline-first on this device, with export/import for backup and APK-ready PWA configuration."
      icon={Settings}
      actions={
        <>
          <OfflineStatus />
          <Badge>v1.0.0</Badge>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="grid gap-5 md:grid-cols-2">
          <div className="paper-texture rounded-[1.8rem] border p-5 shadow-paper">
            <div className="mb-4 flex items-center gap-3">
              <Palette className="size-6 text-primary" aria-hidden />
              <h2 className="font-display text-3xl">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {themeModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <Button
                      key={mode.value}
                      variant={data.settings.themeMode === mode.value ? "default" : "secondary"}
                      onClick={() => updateSettings({ themeMode: mode.value })}
                    >
                      <Icon className="size-4" aria-hidden />
                      {mode.label}
                    </Button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2 rounded-2xl border bg-white/44 p-3 dark:bg-white/6">
                {themeColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    className="size-10 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: color }}
                    onClick={() => updateSettings({ themeColor: color })}
                  />
                ))}
              </div>
              <select
                value={data.settings.font}
                onChange={(event) => updateSettings({ font: event.target.value as "modern" | "serif" | "notebook" })}
                className="h-12 w-full rounded-2xl border bg-white/58 px-4 text-sm font-semibold shadow-inner dark:bg-white/6"
                aria-label="Font"
              >
                <option value="modern">Modern</option>
                <option value="serif">Elegant Serif</option>
                <option value="notebook">Notebook</option>
              </select>
            </div>
          </div>

          <div className="glass-panel rounded-[1.8rem] border p-5">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="size-6 text-emerald-600" aria-hidden />
              <h2 className="font-display text-3xl">Preferences</h2>
            </div>
            <div className="space-y-3">
              <select
                value={data.settings.language}
                onChange={(event) => updateSettings({ language: event.target.value as Language })}
                className="h-12 w-full rounded-2xl border bg-white/58 px-4 text-sm font-semibold shadow-inner dark:bg-white/6"
                aria-label="Language"
              >
                {languages.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between rounded-2xl border bg-white/42 p-3 dark:bg-white/6">
                <div>
                  <p className="text-sm font-bold">Notifications</p>
                  <p className="text-xs text-muted-foreground">Local browser reminders.</p>
                </div>
                <Switch checked={data.settings.notifications} onCheckedChange={requestNotifications} />
              </div>
              <div className="flex items-center justify-between rounded-2xl border bg-white/42 p-3 dark:bg-white/6">
                <div>
                  <p className="text-sm font-bold">Reminder sound</p>
                  <p className="text-xs text-muted-foreground">Use gentle alert sounds.</p>
                </div>
                <Switch checked={data.settings.reminderSound} onCheckedChange={(value) => updateSettings({ reminderSound: value })} />
              </div>
              <div className="flex items-center justify-between rounded-2xl border bg-white/42 p-3 dark:bg-white/6">
                <div>
                  <p className="text-sm font-bold">Diary sounds</p>
                  <p className="text-xs text-muted-foreground">Allow ambient writing audio.</p>
                </div>
                <Switch checked={data.settings.soundsEnabled} onCheckedChange={(value) => updateSettings({ soundsEnabled: value })} />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[1.8rem] border p-5">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="size-6 text-primary" aria-hidden />
              <h2 className="font-display text-3xl">Diary PIN</h2>
            </div>
            <div className="space-y-3">
              <Input
                inputMode="numeric"
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="4 to 8 digits"
                className="text-center tracking-[0.42em]"
              />
              <div className="flex gap-2">
                <Button onClick={savePin} className="flex-1">
                  <Save className="size-4" aria-hidden />
                  Save
                </Button>
                <Button variant="secondary" onClick={() => updateSettings({ diaryPinHash: undefined })}>
                  <Trash2 className="size-4" aria-hidden />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="paper-texture rounded-[1.8rem] border p-5 shadow-paper">
            <div className="mb-4 flex items-center gap-3">
              <HardDrive className="size-6 text-primary" aria-hidden />
              <h2 className="font-display text-3xl">Storage</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border bg-white/48 p-3 dark:bg-white/6">
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>Used</span>
                  <span>{storage ? bytesToHuman(storage.usage) : "..."}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: storage?.quota ? `${Math.min(100, (storage.usage / storage.quota) * 100)}%` : "0%" }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Quota {storage ? bytesToHuman(storage.quota) : "..."}</p>
              </div>
              <Button variant="secondary" className="w-full" onClick={requestPersistentStorage}>
                <ShieldCheck className="size-4" aria-hidden />
                Request Persistent Storage
              </Button>
              <div className="flex flex-wrap gap-2">
                {storage?.cacheNames.length ? storage.cacheNames.map((name) => <Badge key={name}>{name}</Badge>) : <Badge>Cache ready after build</Badge>}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[1.8rem] border bg-blue-950 p-5 text-white shadow-leather">
            <div className="mb-4 flex items-center gap-3">
              <Download className="size-6 text-amber-200" aria-hidden />
              <h2 className="font-display text-3xl">Backup</h2>
            </div>
            <p className="text-sm leading-6 text-white/72">Export creates a local JSON backup. Import restores it into IndexedDB on this device.</p>
            <div className="mt-5 grid gap-2">
              <Button variant="warm" onClick={exportData}>
                <Upload className="size-4" aria-hidden />
                Export Data
              </Button>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Import className="size-4" aria-hidden />
                Import Data
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importData(file);
                  event.currentTarget.value = "";
                }}
              />
            </div>
          </section>

          <section className="paper-texture rounded-[1.8rem] border p-5 shadow-paper">
            <div className="mb-4 flex items-center gap-3">
              <Info className="size-6 text-primary" aria-hidden />
              <h2 className="font-display text-3xl">About</h2>
            </div>
            <div className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>Life Changer Book is a local-first PWA. There is no backend, database server, account system, or cloud sync.</p>
              <p>Data lives in IndexedDB via LocalForage. Small app preferences also mirror through localStorage. Production builds generate a service worker through next-pwa.</p>
              <p>Install from the browser or wrap with PWA Builder, Trusted Web Activity, or Capacitor for Android APK distribution.</p>
            </div>
          </section>

          {message ? (
            <div className="rounded-[1.4rem] border bg-emerald-500/12 p-4 text-sm font-bold text-emerald-800 shadow-glass dark:text-emerald-200">
              {message}
            </div>
          ) : null}
        </aside>
      </div>
    </ModuleFrame>
  );
}
