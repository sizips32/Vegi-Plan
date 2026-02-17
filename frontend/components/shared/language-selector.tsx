"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/lib/types";

const languages: { code: Locale; label: string; abbr: string }[] = [
  { code: "en", label: "English", abbr: "EN" },
  { code: "ko", label: "한국어", abbr: "KR" },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Globe className="size-4" />
          <span className="text-xs font-medium">{current.abbr}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={
              locale === lang.code
                ? "bg-accent text-accent-foreground font-medium"
                : ""
            }
          >
            <span className="text-sm">{lang.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {lang.abbr}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
