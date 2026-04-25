export async function fetchNearbyResources(keywords: string[], zipcode: string){
    const query = `${keywords.join(' ')} near ${zipcode} Queens, New York`; 
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return (data.results || []).slice(0, 3).map((place: any) => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        place_id: place.place_id,
        maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        photo_url: place.photos?.[0]
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            : null,
    }));
}