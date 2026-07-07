import localforage from "localforage";
import type { AppSettings, LifeData } from "@/types/life";

export const DATA_KEY = "life-changer-book:data:v1";
export const LAST_SAVE_KEY = "life-changer-book:last-save";

export const defaultSettings: AppSettings = {
  themeMode: "system",
  themeColor: "#2563EB",
  language: "english",
  notifications: false,
  reminderSound: true,
  font: "modern",
  soundsEnabled: false
};

export const defaultLifeData: LifeData = {
  version: 1,
  diaryPages: [],
  habits: [],
  negativePoints: [],
  motivationFavorites: [],
  tasks: [],
  naamJapCounts: [],
  nameWriteCounts: [],
  settings: defaultSettings
};

if (typeof window !== "undefined") {
  localforage.config({
    name: "LifeChangerBook",
    storeName: "life_changer_book",
    description: "Offline local data for Life Changer Book"
  });
}

function mergeLifeData(value: Partial<LifeData> | null | undefined): LifeData {
  return {
    ...defaultLifeData,
    ...value,
    version: 1,
    diaryPages: Array.isArray(value?.diaryPages) ? value.diaryPages : [],
    habits: Array.isArray(value?.habits) ? value.habits : [],
    negativePoints: Array.isArray(value?.negativePoints) ? value.negativePoints : [],
    motivationFavorites: Array.isArray(value?.motivationFavorites) ? value.motivationFavorites : [],
    tasks: Array.isArray(value?.tasks) ? value.tasks : [],
    naamJapCounts: Array.isArray(value?.naamJapCounts) ? value.naamJapCounts : [],
    nameWriteCounts: Array.isArray(value?.nameWriteCounts) ? value.nameWriteCounts : [],
    settings: {
      ...defaultSettings,
      ...(value?.settings ?? {})
    }
  };
}

export async function loadLifeData(): Promise<LifeData> {
  if (typeof window === "undefined") return defaultLifeData;
  const stored = await localforage.getItem<LifeData>(DATA_KEY);
  return mergeLifeData(stored);
}

export async function saveLifeData(data: LifeData) {
  if (typeof window === "undefined") return;
  const normalized = mergeLifeData(data);
  await localforage.setItem(DATA_KEY, normalized);
  localStorage.setItem(LAST_SAVE_KEY, new Date().toISOString());
}

export function serializeLifeData(data: LifeData) {
  return JSON.stringify(
    {
      app: "Life Changer Book",
      exportedAt: new Date().toISOString(),
      data
    },
    null,
    2
  );
}

export function parseImportedLifeData(text: string) {
  const parsed = JSON.parse(text) as { data?: Partial<LifeData> } | Partial<LifeData>;
  if (typeof parsed === "object" && parsed !== null && "data" in parsed && parsed.data) {
    return mergeLifeData(parsed.data);
  }
  return mergeLifeData(parsed as Partial<LifeData>);
}

export async function getStorageDetails() {
  const estimate =
    typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage
      ? await navigator.storage.estimate()
      : { usage: 0, quota: 0 };
  const cacheNames = typeof caches !== "undefined" ? await caches.keys() : [];
  return {
    usage: estimate.usage ?? 0,
    quota: estimate.quota ?? 0,
    cacheNames
  };
}

export function bytesToHuman(value: number) {
  if (!value) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
