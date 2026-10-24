import { FormEvent, useEffect, useState } from "react";

type IconName =
  | "grid" | "calendar" | "clipboard" | "folder" | "chart" | "clock"
  | "settings" | "moon" | "plus" | "play" | "pause" | "book" | "heart"
  | "target" | "sparkle" | "briefcase" | "music" | "chevron-left"
  | "chevron-right" | "trash" | "sun";

const paths: Record<IconName, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /><path d="m4 7 5-3 5 4 6-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.5 1a8 8 0 0 0-1.8-1L14.3 3h-4.1L10 6a8 8 0 0 0-1.8 1L5.7 6 3.6 9.5l2 1.5a7 7 0 0 0 0 2l-2 1.5L5.7 18l2.5-1a8 8 0 0 0 1.8 1l.3 3h4.1l.3-3a8 8 0 0 0 1.8-1l2.5 1 2-3.5-2-1.5a7 7 0 0 0 .1-1Z" /></>,
  moon: <path d="M20.5 15.5A9 9 0 0 1 8.5 3.5a9 9 0 1 0 12 12Z" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  play: <path d="m9 7 8 5-8 5Z" />,
  pause: <><path d="M9 7v10M15 7v10" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5Z" /><path d="M4 6.5v13" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>,
  sparkle: <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" />,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18" /></>,
  music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2" /></>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type Habit = {
  id: string;
  label: string;
  icon: IconName;
  tone: string;
};

const defaultHabits: Habit[] = [
  { id: "langue", label: "Langue", icon: "book", tone: "purple" },
  { id: "sport", label: "Sport", icon: "target", tone: "orange" },
  { id: "diet", label: "Healthy diet", icon: "heart", tone: "green" },
  { id: "ai", label: "AI", icon: "sparkle", tone: "blue" },
  { id: "social", label: "Social media", icon: "grid", tone: "pink" },
  { id: "coding", label: "Coding", icon: "briefcase", tone: "blue" },
  { id: "quran", label: "Quran", icon: "book", tone: "green" },
  { id: "nawafil", label: "Nawafil", icon: "moon", tone: "purple" },
  { id: "kiyam", label: "Kiyam", icon: "moon", tone: "indigo" },
];

const HABIT_ICONS: IconName[] = ["book", "target", "heart", "sparkle", "grid", "briefcase", "moon", "clock", "music", "chart"];
const HABIT_TONES = ["purple", "orange", "green", "blue", "pink", "indigo"];

function readSavedHabits(): Habit[] {
  try {
    const saved = localStorage.getItem("montra-habits-list-v1");
    return saved ? (JSON.parse(saved) as Habit[]) : defaultHabits;
  } catch {
    return defaultHabits;
  }
}

type StatsPeriod = "Jour" | "Semaine" | "Mois";
type Language = "fr" | "en";
type Theme = "dark" | "light";

const translations = {
  fr: {
    morning: "Bonjour", afternoon: "Bon après-midi", evening: "Bonsoir", tagline: "Concentrer · Planifier · Exécuter · Réussir",
    calendar: "Calendrier", focusTimer: "Minuteur Focus", focus: "Focus", focusing: "Concentration", completed: "Terminé",
    restart: "Recommencer", start: "Démarrer", pause: "Pause", habitTracker: "Suivi des habitudes",
    thisWeek: "Cette semaine", backToWeek: "Revenir à cette semaine", habit: "Habitude", week: "Semaine", month: "Mois",
    statistics: "STATISTIQUES", success: "Réussite", validations: "Validations", habits: "Habitudes",
    habitStats: "Statistiques par habitude", weekly: "Semaine", monthly: "Mois",
    deadlines: "Échéances", add: "Ajouter", upcoming: "À venir", past: "Passées", save: "Enregistrer",
    deadlineName: "Nom de l’échéance", noDeadline: "Aucune échéance", high: "Haute", medium: "Moyenne", low: "Basse",
    settings: "Paramètres", language: "Langue de l’interface", appearance: "Apparence", dark: "Sombre", light: "Clair",
    rights: "Tous droits réservés", live: "DIRECT", day: "Jour", weatherUnavailable: "Météo indisponible", loading: "Chargement...",
    habitName: "Nom de l’habitude", icon: "Icône", color: "Couleur",
  },
  en: {
    morning: "Good Morning", afternoon: "Good Afternoon", evening: "Good Evening", tagline: "Focus · Plan · Execute · Succeed",
    calendar: "Calendar", focusTimer: "Focus Timer", focus: "Focus", focusing: "Focusing", completed: "Completed",
    restart: "Restart", start: "Start", pause: "Pause", habitTracker: "Habit Tracker",
    thisWeek: "This week", backToWeek: "Back to this week", habit: "Habit", week: "Week", month: "Month",
    statistics: "STATISTICS", success: "Success", validations: "Validations", habits: "Habits",
    habitStats: "Statistics by habit", weekly: "Week", monthly: "Month",
    deadlines: "Deadlines", add: "Add", upcoming: "Upcoming", past: "Past", save: "Save",
    deadlineName: "Deadline name", noDeadline: "No deadline", high: "High", medium: "Medium", low: "Low",
    settings: "Settings", language: "Interface language", appearance: "Appearance", dark: "Dark", light: "Light",
    rights: "All rights reserved", live: "LIVE", day: "Day", weatherUnavailable: "Weather unavailable", loading: "Loading...",
    habitName: "Habit name", icon: "Icon", color: "Color",
  },
} as const;

type WeatherData = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

type Deadline = {
  id: string;
  title: string;
  date: string;
  priority: "Haute" | "Moyenne" | "Basse";
};

function weatherLabel(code: number, language: Language) {
  const labels = language === "fr"
    ? ["Ciel dégagé", "Partiellement nuageux", "Couvert", "Brouillard", "Pluie", "Neige", "Averses", "Orage"]
    : ["Clear sky", "Partly cloudy", "Overcast", "Fog", "Rain", "Snow", "Showers", "Thunderstorm"];
  if (code === 0) return labels[0];
  if (code <= 2) return labels[1];
  if (code === 3) return labels[2];
  if (code <= 48) return labels[3];
  if (code <= 67) return labels[4];
  if (code <= 77) return labels[5];
  if (code <= 82) return labels[6];
  return labels[7];
}

function createCalendarDays(year: number, month: number) {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(Date.UTC(year, month, index - firstWeekday + 1));
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth(),
      year: date.getUTCFullYear(),
      key: date.toISOString().slice(0, 10),
    };
  });
}

function createMondayCalendarDays(year: number, month: number) {
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(Date.UTC(year, month, index - firstWeekday + 1));
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth(),
      year: date.getUTCFullYear(),
      key: date.toISOString().slice(0, 10),
    };
  });
}

function getConstantineDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Algiers",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  return { year: value("year"), month: value("month") - 1, day: value("day") };
}

function dateWithOffset(days: number) {
  const { year, month, day } = getConstantineDateParts();
  const date = new Date(Date.UTC(year, month, day + days));
  return date.toISOString().slice(0, 10);
}

function getISOWeekValue(date: Date) {
  const target = new Date(date);
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getWeekStartFromValue(value: string) {
  const [yearText, weekText] = value.split("-W");
  const year = Number(yearText);
  const week = Number(weekText);
  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const monday = new Date(januaryFourth);
  monday.setUTCDate(januaryFourth.getUTCDate() - ((januaryFourth.getUTCDay() + 6) % 7) + (week - 1) * 7);
  return monday;
}

const initialDeadlines: Deadline[] = [
  { id: "coding", title: "Finaliser le projet Coding", date: dateWithOffset(2), priority: "Haute" },
  { id: "ai", title: "Terminer le module AI", date: dateWithOffset(4), priority: "Moyenne" },
  { id: "language", title: "Révision hebdomadaire de langue", date: dateWithOffset(7), priority: "Moyenne" },
  { id: "archive", title: "Ancienne session Quran", date: dateWithOffset(-2), priority: "Basse" },
];

function readSavedList(key: string, fallback: string[]) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function readSavedDeadlines() {
  try {
    const saved = localStorage.getItem("montra-deadlines");
    return saved ? JSON.parse(saved) as Deadline[] : initialDeadlines;
  } catch {
    return initialDeadlines;
  }
}

function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("montra-language") as Language) || "fr");
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("montra-theme") as Theme) || "dark");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("calendar");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [now, setNow] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>("Jour");
  const [statsDayDate, setStatsDayDate] = useState("");
  const [statsWeek, setStatsWeek] = useState("");
  const [statsMonth, setStatsMonth] = useState("");
  const [statsPickerMode, setStatsPickerMode] = useState<StatsPeriod | null>(null);
  const [statsPickerCursor, setStatsPickerCursor] = useState(() => {
    const { year, month } = getConstantineDateParts();
    return { year, month };
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [checked, setChecked] = useState<string[]>(() => readSavedList("montra-habits-v4", []));
  const [habits, setHabits] = useState<Habit[]>(readSavedHabits);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [habitLabel, setHabitLabel] = useState("");
  const [habitIcon, setHabitIcon] = useState<IconName>("book");
  const [habitTone, setHabitTone] = useState("purple");
  const [deadlines, setDeadlines] = useState<Deadline[]>(readSavedDeadlines);
  const [deadlineView, setDeadlineView] = useState<"upcoming" | "past">("upcoming");
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [deadlineTitle, setDeadlineTitle] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlinePriority, setDeadlinePriority] = useState<Deadline["priority"]>("Moyenne");

  useEffect(() => {
    document.title = "Habit Tracker";
  }, []);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const endpoint = "https://api.open-meteo.com/v1/forecast?latitude=36.365&longitude=6.6147&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FAlgiers&forecast_days=3";
    fetch(endpoint, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Météo indisponible");
        return response.json();
      })
      .then((data: WeatherData) => setWeather(data))
      .catch((error) => {
        if (error.name !== "AbortError") setWeatherError(true);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setTimerSeconds((value) => {
        if (value <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => localStorage.setItem("montra-habits-v4", JSON.stringify(checked)), [checked]);
  useEffect(() => localStorage.setItem("montra-habits-list-v1", JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem("montra-deadlines", JSON.stringify(deadlines)), [deadlines]);
  useEffect(() => localStorage.setItem("montra-language", language), [language]);
  useEffect(() => localStorage.setItem("montra-theme", theme), [theme]);

  useEffect(() => {
    const sectionIds = ["calendar", "tracker", "stats", "deadlines"];
    function updateActiveSection() {
      const marker = Math.min(window.innerHeight * 0.32, 260);
      let nextSection = activeNav;
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const distance = Math.abs(rect.top - marker);
        if (distance < closestDistance) {
          closestDistance = distance;
          nextSection = id;
        }
      });

      setActiveNav(nextSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [activeNav]);

  function navigateTo(section: string) {
    setActiveNav(section);
    const element = document.getElementById(section);
    if (!element) return;
    const elementTop = window.scrollY + element.getBoundingClientRect().top;
    const centeredPosition = elementTop - Math.max((window.innerHeight - element.offsetHeight) / 2, 24);
    window.scrollTo({ top: Math.max(centeredPosition, 0), behavior: "smooth" });
  }

  function toggleHabit(habitId: string, date: string) {
    const key = `${habitId}-${date}`;
    setChecked((value) => value.includes(key) ? value.filter((item) => item !== key) : [...value, key]);
  }

  function addHabit(event: FormEvent) {
    event.preventDefault();
    const label = habitLabel.trim();
    if (!label) return;
    const base = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "habit";
    const id = `${base}-${Date.now().toString(36)}`;
    setHabits((current) => [...current, { id, label, icon: habitIcon, tone: habitTone }]);
    setHabitLabel("");
    setHabitIcon("book");
    setHabitTone("purple");
    setShowHabitForm(false);
  }

  function removeHabit(id: string) {
    setHabits((current) => current.filter((habit) => habit.id !== id));
    setChecked((current) => current.filter((key) => !key.startsWith(`${id}-`)));
  }

  function addDeadline(event: FormEvent) {
    event.preventDefault();
    if (!deadlineTitle.trim() || !deadlineDate) return;
    setDeadlines((current) => [...current, {
      id: `${Date.now()}`,
      title: deadlineTitle.trim(),
      date: deadlineDate,
      priority: deadlinePriority,
    }]);
    setDeadlineTitle("");
    setDeadlineDate("");
    setDeadlinePriority("Moyenne");
    setShowDeadlineForm(false);
  }

  function openStatsPicker(period: StatsPeriod) {
    setStatsPeriod(period);
    setStatsPickerMode(period);
    if (period === "Jour") {
      const date = new Date(`${selectedStatsDay}T12:00:00Z`);
      setStatsPickerCursor({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
    } else if (period === "Semaine") {
      setStatsPickerCursor({ year: selectedStatsWeekStart.getUTCFullYear(), month: selectedStatsWeekStart.getUTCMonth() });
    } else {
      setStatsPickerCursor({ year: statsMonthYear, month: statsMonthNumber - 1 });
    }
  }

  function moveStatsPicker(direction: number) {
    if (statsPickerMode === "Mois") {
      setStatsPickerCursor((current) => ({ ...current, year: current.year + direction }));
      return;
    }
    setStatsPickerCursor((current) => {
      const date = new Date(Date.UTC(current.year, current.month + direction, 1));
      return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
    });
  }

  function selectStatsCalendarDate(date: string) {
    if (statsPickerMode === "Jour") {
      setStatsDayDate(date);
    } else {
      setStatsWeek(getISOWeekValue(new Date(`${date}T12:00:00Z`)));
    }
    setStatsPickerMode(null);
  }

  const { year: constantineYear, month: constantineMonth, day: constantineDay } = getConstantineDateParts(now);
  const calendarDays = createCalendarDays(constantineYear, constantineMonth);
  const todayKey = `${constantineYear}-${String(constantineMonth + 1).padStart(2, "0")}-${String(constantineDay).padStart(2, "0")}`;
  const activeDate = selectedDate || todayKey;
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(constantineYear, constantineMonth, 1)));
  const formattedTimer = `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(timerSeconds % 60).padStart(2, "0")}`;
  const clockHours = now.toLocaleTimeString("fr-FR", { timeZone: "Africa/Algiers", hour: "2-digit", minute: "2-digit", hour12: false });
  const constantineHour = Number(now.toLocaleTimeString("en-US", { timeZone: "Africa/Algiers", hour: "2-digit", hour12: false }));
  const dateText = now.toLocaleDateString("fr-FR", { timeZone: "Africa/Algiers", weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const currentWeatherCode = weather?.current.weather_code ?? 2;
  const today = new Date(Date.UTC(constantineYear, constantineMonth, constantineDay));
  const mondayOffset = (today.getUTCDay() + 6) % 7;
  const weekStart = new Date(today);
  weekStart.setUTCDate(today.getUTCDate() - mondayOffset + weekOffset * 7);
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setUTCDate(weekStart.getUTCDate() + index);
    return {
      key: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString("fr-FR", { weekday: "short", timeZone: "UTC" }).slice(0, 2),
      number: date.getUTCDate(),
    };
  });
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  const selectedWeekLabel = `${weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" })} – ${weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
  const trackingMonthDate = new Date(weekStart);
  trackingMonthDate.setUTCDate(weekStart.getUTCDate() + 3);
  const trackingYear = trackingMonthDate.getUTCFullYear();
  const trackingMonth = trackingMonthDate.getUTCMonth();
  const monthPrefix = `${trackingYear}-${String(trackingMonth + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(Date.UTC(trackingYear, trackingMonth + 1, 0)).getUTCDate();
  const upcomingDeadlines = deadlines.filter((deadline) => deadline.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
  const pastDeadlines = deadlines.filter((deadline) => deadline.date < todayKey).sort((a, b) => b.date.localeCompare(a.date));
  const visibleDeadlines = deadlineView === "upcoming" ? upcomingDeadlines : pastDeadlines;
  const selectedStatsDay = statsDayDate || todayKey;
  const selectedStatsWeekStart = statsWeek ? getWeekStartFromValue(statsWeek) : weekStart;
  const selectedStatsWeekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(selectedStatsWeekStart);
    date.setUTCDate(selectedStatsWeekStart.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
  const selectedStatsWeekEnd = new Date(selectedStatsWeekStart);
  selectedStatsWeekEnd.setUTCDate(selectedStatsWeekStart.getUTCDate() + 6);
  const selectedStatsWeekLabel = `${selectedStatsWeekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" })} – ${selectedStatsWeekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
  const selectedMonthPrefix = statsMonth || monthPrefix;
  const [statsMonthYear, statsMonthNumber] = selectedMonthPrefix.split("-").map(Number);
  const selectedMonthDaysCount = new Date(Date.UTC(statsMonthYear, statsMonthNumber, 0)).getUTCDate();
  const selectedMonthDates = Array.from({ length: selectedMonthDaysCount }, (_, index) => `${selectedMonthPrefix}-${String(index + 1).padStart(2, "0")}`);
  const statsCards = (["Jour", "Semaine", "Mois"] as StatsPeriod[]).map((period) => {
    const dates = period === "Jour" ? [selectedStatsDay] : period === "Semaine" ? selectedStatsWeekDates : selectedMonthDates;
    const validations = checked.filter((key) => dates.some((date) => key.endsWith(date))).length;
    const activeHabits = habits.filter((habit) => dates.some((date) => checked.includes(`${habit.id}-${date}`))).length;
    const maximum = habits.length * dates.length;
    const score = maximum ? Math.round((validations / maximum) * 100) : 0;
    const label = period === "Jour"
      ? new Date(`${selectedStatsDay}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" })
      : period === "Semaine"
        ? selectedStatsWeekLabel
        : new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(statsMonthYear, statsMonthNumber - 1, 1)));
    return { period, validations, activeHabits, maximum, score, label };
  });
  const statsPickerDays = createMondayCalendarDays(statsPickerCursor.year, statsPickerCursor.month);
  const statsPickerTitle = statsPickerMode === "Mois"
    ? String(statsPickerCursor.year)
    : new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(statsPickerCursor.year, statsPickerCursor.month, 1)));
  const ui = translations[language];
  const greeting = constantineHour < 12 ? ui.morning : constantineHour < 18 ? ui.afternoon : ui.evening;

  return (
    <div className={`night-app ${theme}`}>
      <div className="sky-glow" />
      <div className="window-dots"><span /><span /><span /></div>

      <aside className="side-rail" aria-label="Navigation principale">
        <button className={`rail-button ${activeNav === "calendar" ? "active" : ""}`} onClick={() => navigateTo("calendar")} aria-label={ui.calendar}><Icon name="calendar" /></button>
        <button className={`rail-button ${activeNav === "tracker" ? "active" : ""}`} onClick={() => navigateTo("tracker")} aria-label={ui.habitTracker}><Icon name="clipboard" /></button>
        <button className={`rail-button ${activeNav === "stats" ? "active" : ""}`} onClick={() => navigateTo("stats")} aria-label="Statistiques"><Icon name="chart" /></button>
        <button className={`rail-button ${activeNav === "deadlines" ? "active" : ""}`} onClick={() => navigateTo("deadlines")} aria-label={ui.deadlines}><Icon name="folder" /></button>
        <button className={`rail-button settings-nav-button ${settingsOpen ? "active" : ""}`} onClick={() => setSettingsOpen(true)} aria-label={ui.settings}><Icon name="settings" /></button>
        <button className="rail-button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? ui.light : ui.dark}><Icon name={theme === "dark" ? "sun" : "moon"} /></button>
      </aside>

      <main className="workspace">
        <header className="hero" id="home">
          <div>
            <h1>{greeting},<br /><strong>Douaa.</strong></h1>
            <p>{ui.tagline}</p>
          </div>
          <div className="clock-display">
            <div>{clockHours} <span>{ui.live}</span></div>
            <p>{dateText}</p>
          </div>
        </header>

        <section className="dashboard-grid">
          <article className="glass-card calendar-card" id="calendar">
            <h2>{ui.calendar}</h2>
            <div className="month-nav"><Icon name="chevron-left" size={15} /><span className="month-name">{monthLabel}</span><Icon name="chevron-right" size={15} /></div>
            <div className="calendar-grid weekdays">{["D", "L", "M", "M", "J", "V", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
            <div className="calendar-grid dates">
              {calendarDays.map((date) => {
                return (
                  <button
                    className={`${date.month !== constantineMonth ? "muted" : ""} ${activeDate === date.key ? "selected" : ""}`}
                    onClick={() => setSelectedDate(date.key)}
                    key={date.key}
                    aria-label={`Sélectionner le ${date.day} ${monthLabel}`}
                  >
                    {date.day}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="glass-card timer-card" id="timer">
            <h2>{ui.focusTimer}</h2>
            <div className={`timer-ring ${timerRunning ? "running" : ""}`}>
              <div><strong>{formattedTimer}</strong><span>{timerRunning ? ui.focusing : timerSeconds === 0 ? ui.completed : ui.focus}</span></div>
            </div>
            <div className="timer-controls">
              <button className="timer-restart" onClick={() => { setTimerRunning(false); setTimerSeconds(25 * 60); }} aria-label={ui.restart}>↺ <span>{ui.restart}</span></button>
              <button className="timer-adjust" onClick={() => { setTimerSeconds((value) => Math.max(value - 5 * 60, 0)); if (timerSeconds <= 5 * 60) setTimerRunning(false); }} aria-label="Retirer cinq minutes">−5</button>
              <button className="timer-play" onClick={() => setTimerRunning((value) => !value)} aria-label={timerRunning ? "Pause" : "Démarrer"}>
                <Icon name={timerRunning ? "pause" : "play"} size={15} />
                <span>{timerRunning ? ui.pause : ui.start}</span>
              </button>
              <button className="timer-adjust" onClick={() => setTimerSeconds((value) => Math.min(value + 5 * 60, 60 * 60))} aria-label="Ajouter cinq minutes">+5</button>
            </div>
          </article>

          <article className="glass-card weather-card">
            <div className="weather-location">CONSTANTINE, ALGÉRIE <span className="live-dot" /></div>
            <div className={`weather-illustration code-${currentWeatherCode}`}><div className="weather-sun" /><div className="weather-cloud"><i /><i /><i /></div></div>
            <div className="temperature">{weather ? `${Math.round(weather.current.temperature_2m)}°` : weatherError ? "--°" : "…"}</div>
            <p>{weatherError ? ui.weatherUnavailable : weather ? weatherLabel(weather.current.weather_code, language) : ui.loading}</p>
            <div className="range">
              <span>↑ {weather ? `${Math.round(weather.daily.temperature_2m_max[0])}°` : "--"}</span>
              <span>↓ {weather ? `${Math.round(weather.daily.temperature_2m_min[0])}°` : "--"}</span>
            </div>
            <div className="forecast">
              {weather ? weather.daily.time.map((date, index) => (
                <div key={date}>
                  <span>{new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "")}</span>
                  {weather.daily.weather_code[index] <= 1 ? <Icon name="sun" size={18} /> : <div className="mini-cloud" />}
                  <strong>{Math.round(weather.daily.temperature_2m_max[index])}°</strong>
                </div>
              )) : [0, 1, 2].map((item) => <div className="forecast-loading" key={item}><span>--</span><div className="mini-cloud" /><strong>--°</strong></div>)}
            </div>
            <div className="weather-source">Données en direct · Open‑Meteo</div>
          </article>

          <article className="glass-card tracker-card" id="tracker">
            <h2>{ui.habitTracker}</h2>
            <div className="card-title-row">
              <span className="tracker-period">{selectedWeekLabel}</span>
              <div className="tracker-controls">
                <div className="week-picker">
                  <button onClick={() => setWeekOffset((value) => value - 1)} aria-label="Semaine précédente"><Icon name="chevron-left" size={14} /></button>
                  <button className="current-week" onClick={() => setWeekOffset(0)} disabled={weekOffset === 0}>{weekOffset === 0 ? ui.thisWeek : ui.backToWeek}</button>
                  <button onClick={() => setWeekOffset((value) => value + 1)} aria-label="Semaine suivante"><Icon name="chevron-right" size={14} /></button>
                </div>
                <button className="add-button" onClick={() => setShowHabitForm((value) => !value)}>
                  <Icon name="plus" size={13} /> {ui.add}
                </button>
              </div>
            </div>

            {showHabitForm && (
              <form className="habit-form" onSubmit={addHabit}>
                <input
                  value={habitLabel}
                  onChange={(event) => setHabitLabel(event.target.value)}
                  placeholder={ui.habitName}
                  autoFocus
                />
                <select value={habitIcon} onChange={(event) => setHabitIcon(event.target.value as IconName)} aria-label={ui.icon}>
                  {HABIT_ICONS.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
                <select value={habitTone} onChange={(event) => setHabitTone(event.target.value)} aria-label={ui.color}>
                  {HABIT_TONES.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
                </select>
                <button type="submit">{ui.save}</button>
              </form>
            )}

            <div className="tracker-head">
              <span>{ui.habit}</span>
              {weekDates.map((date) => <span className={date.key === todayKey ? "today" : ""} key={date.key}>{date.day}<b>{date.number}</b></span>)}
              <span>{ui.week}</span><span>{ui.month}</span>
            </div>
            <div className="habit-table">
              {habits.map((habit) => {
                const weekCount = weekDates.filter((date) => checked.includes(`${habit.id}-${date.key}`)).length;
                const monthCount = checked.filter((key) => key.startsWith(`${habit.id}-${monthPrefix}`)).length;
                return (
                  <div className="habit-row" key={habit.id}>
                    <div>
                      <span className={`habit-symbol ${habit.tone}`}><Icon name={habit.icon} size={12} /></span>
                      <strong>{habit.label}</strong>
                      <button
                        className="delete-habit"
                        onClick={() => removeHabit(habit.id)}
                        aria-label={`Supprimer ${habit.label}`}
                        type="button"
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                    {weekDates.map((date) => {
                      const active = checked.includes(`${habit.id}-${date.key}`);
                      return <button className={`habit-day ${active ? "active" : ""}`} onClick={() => toggleHabit(habit.id, date.key)} aria-label={`${habit.label}, ${date.day} ${date.number}`} key={date.key}>{active && "✓"}</button>;
                    })}
                    <div className="habit-stat"><strong>{weekCount} j</strong><span>{Math.round((weekCount / 7) * 100)}%</span></div>
                    <div className="habit-stat"><strong>{monthCount} j</strong><span>{Math.round((monthCount / daysInMonth) * 100)}%</span></div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="glass-card deadlines-card" id="deadlines">
            <div className="card-title-row">
              <h2>{ui.deadlines}</h2>
              <button className="add-button" onClick={() => setShowDeadlineForm((value) => !value)}><Icon name="plus" size={13} /> {ui.add}</button>
            </div>
            <div className="deadline-tabs">
              <button className={deadlineView === "upcoming" ? "active" : ""} onClick={() => setDeadlineView("upcoming")}>{ui.upcoming} <span>{upcomingDeadlines.length}</span></button>
              <button className={deadlineView === "past" ? "active" : ""} onClick={() => setDeadlineView("past")}>{ui.past} <span>{pastDeadlines.length}</span></button>
            </div>
            {showDeadlineForm && (
              <form className="deadline-form" onSubmit={addDeadline}>
                <input value={deadlineTitle} onChange={(event) => setDeadlineTitle(event.target.value)} placeholder={ui.deadlineName} autoFocus />
                <input type="date" value={deadlineDate} onChange={(event) => setDeadlineDate(event.target.value)} />
                <select value={deadlinePriority} onChange={(event) => setDeadlinePriority(event.target.value as Deadline["priority"])}>
                  <option value="Haute">{ui.high}</option><option value="Moyenne">{ui.medium}</option><option value="Basse">{ui.low}</option>
                </select>
                <button type="submit">{ui.save}</button>
              </form>
            )}
            <div className="deadline-list">
              {visibleDeadlines.length === 0 && <div className="empty-state">{ui.noDeadline}.</div>}
              {visibleDeadlines.map((deadline) => {
                const tone = deadline.priority === "Haute" ? "purple" : deadline.priority === "Moyenne" ? "blue" : "orange";
                return (
                  <div className="deadline-row" key={deadline.id}>
                    <span className={`deadline-icon ${tone}`}><Icon name="calendar" size={17} /></span>
                    <div>
                      <strong>{deadline.title}</strong>
                      <span>{new Date(`${deadline.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <small className={tone}>{deadline.priority}</small>
                    <button className="delete-deadline" onClick={() => setDeadlines((current) => current.filter((item) => item.id !== deadline.id))} aria-label={`Supprimer ${deadline.title}`}><Icon name="trash" size={14} /></button>
                  </div>
                );
              })}
            </div>
          </article>

          {statsCards.map((card) => (
            <article className={`glass-card stat-circle-card ${statsPeriod === card.period ? "selected" : ""}`} id={card.period === "Jour" ? "stats" : undefined} key={card.period}>
              <div className="stat-circle-header">
                <div><span>{ui.statistics}</span><h2>{card.period === "Jour" ? ui.day : card.period === "Semaine" ? ui.week : ui.month}</h2></div>
                <button onClick={() => openStatsPicker(card.period)} aria-label={`Choisir ${card.period.toLowerCase()}`}><Icon name="calendar" size={15} /></button>
              </div>
              <span className="stat-circle-date">{card.label}</span>
              <div className="stat-ring" style={{ background: `conic-gradient(#a94eea ${card.score * 3.6}deg, #5133d9 ${card.score * 3.6}deg, rgba(109,91,178,.16) 0)` }}>
                <div><strong>{card.score}%</strong><span>{ui.success}</span></div>
              </div>
              <div className="stat-circle-footer">
                <div><strong>{card.validations}/{card.maximum}</strong><span>{ui.validations}</span></div>
                <i />
                <div><strong>{card.activeHabits}/{habits.length}</strong><span>{ui.habits}</span></div>
              </div>
            </article>
          ))}

          <article className="glass-card habit-analytics-card">
            <div className="habit-analytics-header">
              <div>
                <span>{ui.statistics}</span>
                <h2>{ui.habitStats}</h2>
              </div>
              <div className="habit-period-pickers">
                <button onClick={() => openStatsPicker("Semaine")}>
                  <span>{ui.weekly}</span>
                  <strong>{selectedStatsWeekLabel}</strong>
                  <Icon name="calendar" size={14} />
                </button>
                <button onClick={() => openStatsPicker("Mois")}>
                  <span>{ui.monthly}</span>
                  <strong>{new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(statsMonthYear, statsMonthNumber - 1, 1)))}</strong>
                  <Icon name="calendar" size={14} />
                </button>
              </div>
            </div>
            <div className="habit-analytics-scroll">
              {habits.map((habit) => {
                const weekCount = selectedStatsWeekDates.filter((date) => checked.includes(`${habit.id}-${date}`)).length;
                const monthCount = selectedMonthDates.filter((date) => checked.includes(`${habit.id}-${date}`)).length;
                const weekScore = Math.round((weekCount / 7) * 100);
                const monthScore = Math.round((monthCount / selectedMonthDaysCount) * 100);
                return (
                  <div className="habit-analytics-item" key={habit.id}>
                    <div className="habit-analytics-name">
                      <span className={`habit-symbol ${habit.tone}`}><Icon name={habit.icon} size={14} /></span>
                      <strong>{habit.label}</strong>
                    </div>
                    <div className="habit-rings">
                      <div>
                        <div className="mini-stat-ring" style={{ background: `conic-gradient(var(--${habit.tone}) ${weekScore * 3.6}deg, rgba(122,111,165,.17) 0)` }}><span>{weekScore}%</span></div>
                        <strong>{ui.weekly}</strong><small>{weekCount}/7</small>
                      </div>
                      <div>
                        <div className="mini-stat-ring month" style={{ background: `conic-gradient(var(--${habit.tone}) ${monthScore * 3.6}deg, rgba(122,111,165,.17) 0)` }}><span>{monthScore}%</span></div>
                        <strong>{ui.monthly}</strong><small>{monthCount}/{selectedMonthDaysCount}</small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {statsPickerMode && (
            <div className="stats-calendar-backdrop" onClick={() => setStatsPickerMode(null)}>
              <div className="stats-calendar-popover" onClick={(event) => event.stopPropagation()}>
                <div className="stats-calendar-nav">
                  <button onClick={() => moveStatsPicker(-1)} aria-label={statsPickerMode === "Mois" ? "Année précédente" : "Mois précédent"}><Icon name="chevron-left" size={13} /></button>
                  <strong>{statsPickerTitle}</strong>
                  <button onClick={() => moveStatsPicker(1)} aria-label={statsPickerMode === "Mois" ? "Année suivante" : "Mois suivant"}><Icon name="chevron-right" size={13} /></button>
                </div>
                {statsPickerMode === "Mois" ? (
                  <div className="stats-month-grid">
                    {Array.from({ length: 12 }, (_, month) => {
                      const value = `${statsPickerCursor.year}-${String(month + 1).padStart(2, "0")}`;
                      return (
                        <button
                          className={value === selectedMonthPrefix ? "selected" : ""}
                          onClick={() => { setStatsMonth(value); setStatsPickerMode(null); }}
                          key={value}
                        >
                          {new Date(Date.UTC(statsPickerCursor.year, month, 1)).toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" })}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <div className="stats-calendar-weekdays">{["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
                    <div className="stats-calendar-days">
                      {statsPickerDays.map((date) => {
                        const selected = statsPickerMode === "Jour" ? date.key === selectedStatsDay : selectedStatsWeekDates.includes(date.key);
                        return <button className={`${date.month !== statsPickerCursor.month ? "muted" : ""} ${selected ? "selected" : ""}`} onClick={() => selectStatsCalendarDate(date.key)} key={date.key}>{date.day}</button>;
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </section>
        <footer className="app-footer">© {new Date().getFullYear()} Douaa Benkhalef · {ui.rights}</footer>
      </main>

      {settingsOpen && (
        <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}>
          <section className="settings-panel" onClick={(event) => event.stopPropagation()}>
            <div className="settings-title"><div><span>{ui.settings}</span><h2>{ui.language}</h2></div><button onClick={() => setSettingsOpen(false)} aria-label="Fermer">×</button></div>
            <div className="settings-options">
              <button className={language === "fr" ? "active" : ""} onClick={() => setLanguage("fr")}><strong>Français</strong><span>Interface en français</span></button>
              <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}><strong>English</strong><span>English interface</span></button>
            </div>
            <h3>{ui.appearance}</h3>
            <div className="theme-options">
              <button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}><Icon name="moon" size={15} />{ui.dark}</button>
              <button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}><Icon name="sun" size={15} />{ui.light}</button>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}

export default App;