import { ResourceOrg } from "@/types";

export function ResourceCard({ org }: { org: ResourceOrg }) {
  const staticMap = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
    org.address
  )}&zoom=15&size=600x200&markers=${encodeURIComponent(org.address)}&key=${
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  }`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    org.address
  )}`;

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card">
      {org.photo_url ? (
        <img
          src={org.photo_url}
          className="w-full h-32 object-cover"
          alt={org.name}
        />
      ) : (
        <img src={staticMap} className="w-full h-32 object-cover" alt="map" />
      )}
      <div className="p-3 space-y-1">
        <p className="font-semibold text-sm">{org.name}</p>
        <p className="text-xs text-muted-foreground">{org.address}</p>
        {org.rating && <p className="text-xs">⭐ {org.rating}</p>}
        <div className="flex gap-2 pt-1">
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg"
          >
            Get Directions
          </a>
          <a
            href={org.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs border border-border px-3 py-1.5 rounded-lg"
          >
            View on Maps
          </a>
        </div>
      </div>
    </div>
  );
}
