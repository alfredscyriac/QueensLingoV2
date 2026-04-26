"use client";

import { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
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
  language: Language | null;
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
    <div className="grid grid-cols-2 gap-4 w-full max-w-[640px] mx-auto">
      <Popover open={langOpen} onOpenChange={setLangOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={langOpen}
            className="w-full appearance-none bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-white text-sm outline-none focus:border-[#E91E7B]/50 transition-all cursor-pointer shadow-lg flex items-center justify-between"
          >
            {language ? language.native : <span className="text-white/50">Select language…</span>}
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 text-white/50" />
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
                    data-checked={lang.code === language?.code}
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
            className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-white text-sm outline-none focus:border-[#E91E7B]/50 transition-all cursor-pointer shadow-lg flex items-center justify-between"
          >
            {zipcode || <span className="text-white/50">Select ZIP…</span>}
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 text-white/50" />
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
