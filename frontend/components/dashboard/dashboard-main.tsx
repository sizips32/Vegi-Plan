"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  UtensilsCrossed,
  ScanLine,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Header } from "./header";
import { OverviewTab } from "./overview-tab";
import { PlannerTab } from "./planner-tab";
import { DailyLogTab } from "./daily-log-tab";
import { RecipesTab } from "./recipes-tab";
import { ScannerTab } from "./scanner-tab";
import { SettingsDialog } from "./settings-dialog";

const TAB_KEYS = [
  "overview",
  "planner",
  "dailyLog",
  "recipes",
  "scanner",
] as const;

const TAB_ICONS = {
  overview: LayoutDashboard,
  planner: CalendarDays,
  dailyLog: UtensilsCrossed,
  recipes: BookOpen,
  scanner: ScanLine,
};

export default function DashboardMain() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-full overflow-x-auto flex justify-start md:justify-center gap-1 bg-muted/50 p-1">
            {TAB_KEYS.map((key) => {
              const Icon = TAB_ICONS[key];
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap px-3 py-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t.tabs[key as keyof typeof t.tabs]}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="mt-6">
                <OverviewTab />
              </TabsContent>
              <TabsContent value="planner" className="mt-6">
                <PlannerTab />
              </TabsContent>
              <TabsContent value="dailyLog" className="mt-6">
                <DailyLogTab />
              </TabsContent>
              <TabsContent value="recipes" className="mt-6">
                <RecipesTab />
              </TabsContent>
              <TabsContent value="scanner" className="mt-6">
                <ScannerTab />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
