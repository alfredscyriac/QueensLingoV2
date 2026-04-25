"use client";

import { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/languages";
import { QUEENS_ZIPCODES } from "@/lib/zipcodes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface LanguageZipSelectorProps {
  onLanguageChange?: (code: string) => void;
  onZipChange?: (zip: string) => void;
}

export function LanguageZipSelector({
  onLanguageChange,
  onZipChange,
}: LanguageZipSelectorProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [zipOpen, setZipOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [zip, setZip] = useState("");

  const selectedLang = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="flex gap-4">
      <Popover open={langOpen} onOpenChange={setLangOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={langOpen}
            className={cn(
              "flex h-9 w-52 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
              !language && "text-muted-foreground"
            )}
          >
            {selectedLang ? selectedLang.native : "Select language…"}
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-0">
          <Command>
            <CommandInput placeholder="Search language…" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {LANGUAGES.map((lang) => (
                  <CommandItem
                    key={lang.code}
                    value={`${lang.native} ${lang.label}`}
                    data-checked={lang.code === language}
                    onSelect={() => {
                      const next = lang.code === language ? "" : lang.code;
                      setLanguage(next);
                      onLanguageChange?.(next);
                      setLangOpen(false);
                    }}
                  >
                    <span className="font-medium">{lang.native}</span>
                    <span className="ml-1.5 text-muted-foreground">
                      {lang.label}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={zipOpen} onOpenChange={setZipOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={zipOpen}
            className={cn(
              "flex h-9 w-36 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
              !zip && "text-muted-foreground"
            )}
          >
            {zip || "Select ZIP…"}
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-0">
          <Command>
            <CommandInput placeholder="Filter ZIP…" />
            <CommandList>
              <CommandEmpty>No ZIP found.</CommandEmpty>
              <CommandGroup>
                {QUEENS_ZIPCODES.map((z) => (
                  <CommandItem
                    key={z}
                    value={z}
                    data-checked={z === zip}
                    onSelect={() => {
                      const next = z === zip ? "" : z;
                      setZip(next);
                      onZipChange?.(next);
                      setZipOpen(false);
                    }}
                  >
                    {z}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
