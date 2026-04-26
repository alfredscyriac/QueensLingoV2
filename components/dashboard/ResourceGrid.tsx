import { ResourceOrg } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { MapPin } from "lucide-react";

export function ResourceGrid({ resources }: { resources: ResourceOrg[] }) {
  return (
    <div className="w-full max-w-[640px] mx-auto space-y-3">
      <div className="flex items-center gap-2 px-1">
        <MapPin size={14} className="text-[#E91E7B]" />
        <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">
          Nearby Resources
        </p>
      </div>
      {resources.map((org) => (
        <ResourceCard key={org.place_id} org={org} />
      ))}
    </div>
  );
}
