import { ResourceOrg } from "@/types";
import { ResourceCard } from "./ResourceCard";

export function ResourceGrid({ resources }: { resources: ResourceOrg[] }) {
  return (
    <div className="space-y-3">
      {resources.map((org) => (
        <ResourceCard key={org.place_id} org={org} />
      ))}
    </div>
  );
}
