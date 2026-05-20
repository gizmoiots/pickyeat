// Google Places API wrapper. Live mode uses the official SDK.

import { Client, Language } from "@googlemaps/google-maps-services-js";
import { isMockMode } from "../db.js";
import { cafeMocha } from "../mockData.js";

let _client: Client | null = null;
function gmap(): Client {
  if (!_client) _client = new Client();
  return _client;
}

type Restaurant = {
  id: string;
  googlePlaceId: string;
  name: string;
  address: string;
  cuisineTags: string[];
  googleRating?: number;
  googleReviewCount?: number;
  scanCount?: number;
  bestsellers?: string[];
};

export async function nearbyRestaurants(
  lat: number,
  lng: number
): Promise<Restaurant[]> {
  if (isMockMode() || !process.env.GOOGLE_PLACES_API_KEY) {
    return [cafeMocha as Restaurant];
  }

  const r = await gmap().placesNearby({
    params: {
      location: { lat, lng },
      radius: 100,
      type: "restaurant" as any,
      language: Language.en,
      key: process.env.GOOGLE_PLACES_API_KEY!
    },
    timeout: 4000
  });

  // Closest first, then map into our Restaurant shape
  return r.data.results.slice(0, 10).map((p) => ({
    id: `rst_${p.place_id}`,
    googlePlaceId: p.place_id!,
    name: p.name ?? "Unnamed restaurant",
    address: p.vicinity ?? "",
    cuisineTags: (p.types ?? []).filter((t) => t !== "restaurant" && t !== "food"),
    googleRating: p.rating,
    googleReviewCount: p.user_ratings_total,
    scanCount: 0
  }));
}

export async function placeDetails(placeId: string): Promise<{
  reviews: { author: string; rating: number; text: string }[];
  photos: string[];
  rating?: number;
  reviewCount?: number;
}> {
  if (isMockMode() || !process.env.GOOGLE_PLACES_API_KEY) {
    return {
      reviews: [
        {
          author: "Ananya R",
          rating: 5,
          text: "Their butter chicken is unreal — best in Pune by a mile."
        },
        {
          author: "Manish K",
          rating: 4,
          text: "Loved the ambience. The paneer tikka masala is a must."
        }
      ],
      photos: [],
      rating: 4.3,
      reviewCount: 1248
    };
  }

  const r = await gmap().placeDetails({
    params: {
      place_id: placeId,
      fields: ["name", "rating", "user_ratings_total", "review", "photo", "formatted_address"],
      language: Language.en,
      key: process.env.GOOGLE_PLACES_API_KEY!
    },
    timeout: 4000
  });

  const d = r.data.result;
  return {
    reviews: (d.reviews ?? []).map((rv) => ({
      author: rv.author_name,
      rating: rv.rating ?? 0,
      text: rv.text ?? ""
    })),
    photos: (d.photos ?? []).slice(0, 5).map((p) => p.photo_reference ?? ""),
    rating: d.rating,
    reviewCount: d.user_ratings_total
  };
}
