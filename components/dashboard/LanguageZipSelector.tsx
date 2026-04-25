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

type Language = (typeof LANGUAGES)[number];

interface LanguageZipSelectorProps {
  language: Language;
  zipcode: string;
  onLanguageChange: (lang: Language) => void;
  onZipcodeChange: (zip: string) => void;
}

export function LanguageZipSelector({
  language,
  zipcode,
  onLanguageChange,
  onZipcodeChange,
}: LanguageZipSelectorProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [zipOpen, setZipOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <Popover open={langOpen} onOpenChange={setLangOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={langOpen}
            className="flex h-9 w-52 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {language.native}
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
                    data-checked={lang.code === language.code}
                    onSelect={() => {
                      onLanguageChange(lang);
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
              !zipcode && "text-muted-foreground"
            )}
          >
            {zipcode || "Select ZIP…"}
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
                    data-checked={z === zipcode}
                    onSelect={() => {
                      onZipcodeChange(z === zipcode ? "" : z);
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
