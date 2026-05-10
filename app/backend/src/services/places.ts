// Google Places API wrapper. Stubbed in mock mode.

import { isMockMode } from "../db.js";
import { cafeMocha } from "../mockData.js";

export async function nearbyRestaurants(_lat: number, _lng: number) {
  if (isMockMode()) return [cafeMocha];

  // TODO: GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
  //   ?location={lat},{lng}&radius=100&type=restaurant&key=GOOGLE_PLACES_API_KEY
  // Map results to our Restaurant shape and persist to `restaurants` table.
  throw new Error("places.nearbyRestaurants live mode not wired yet");
}

export async function placeDetails(_placeId: string) {
  if (isMockMode()) {
    return {
      reviews: [
        { author: "Ananya R", rating: 5, text: "Their butter chicken is unreal — best in Pune by a mile." },
        { author: "Manish K", rating: 4, text: "Loved the ambience. The paneer tikka masala is a must." }
      ]
    };
  }

  // TODO: GET https://maps.googleapis.com/maps/api/place/details/json
  // Then run review.text through Claude to extract dish mentions + sentiment.
  throw new Error("places.placeDetails live mode not wired yet");
}
