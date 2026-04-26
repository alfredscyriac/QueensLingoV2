import { ResourceOrg } from "@/types";
import { MapPin, Star, Navigation, Map } from "lucide-react";

export function ResourceCard({ org }: { org: ResourceOrg }) {
  const staticMap = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
    org.address
  )}&zoom=15&size=600x200&markers=color:0xE91E7B|${encodeURIComponent(org.address)}&key=${
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  }`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    org.address
  )}`;

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl relative">
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

      {/* Map / photo image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={org.photo_url ?? staticMap}
          className="w-full h-full object-cover"
          alt={org.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {org.rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{org.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="font-bold text-white text-sm leading-snug">{org.name}</p>
          <div className="flex items-start gap-1.5 mt-1">
            <MapPin size={12} className="text-white/40 mt-0.5 shrink-0" />
            <p className="text-xs text-white/50 leading-snug">{org.address}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#E91E7B] hover:bg-[#d0186c] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-[#E91E7B]/20"
          >
            <Navigation size={13} />
            Directions
          </a>
          <a
            href={org.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            <Map size={13} />
            View on Maps
          </a>
        </div>
      </div>
    </div>
  );
}
