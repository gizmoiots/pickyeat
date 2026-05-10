// Single API client. In `mock` mode it returns local mock data so the
// frontend can run standalone for design/demos. In `live` mode it hits
// the Express backend at NEXT_PUBLIC_API_BASE.

import {
  cafeMocha,
  dishes,
  dishById,
  samplePicks,
  sampleGroup,
  sampleProfile
} from "./mockData";
import type { Dish, Group, Pick, Prefs, Profile, Restaurant } from "./types";

const MODE = process.env.NEXT_PUBLIC_API_MODE ?? "mock";
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

async function live<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`api ${path} → ${res.status}`);
  return res.json();
}

// Pretend the call took a beat — keeps the mock-mode UX from feeling
// instantaneous and helps catch loading-state bugs.
const tick = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async detectRestaurant(_lat: number, _lng: number): Promise<Restaurant | null> {
    if (MODE === "mock") {
      await tick();
      return cafeMocha;
    }
    return live<Restaurant | null>(`/api/places/nearby?lat=${_lat}&lng=${_lng}`);
  },

  async getMenu(restaurantId: string): Promise<{ restaurant: Restaurant; dishes: Dish[] }> {
    if (MODE === "mock") {
      await tick();
      return { restaurant: cafeMocha, dishes };
    }
    return live(`/api/menu/${restaurantId}`);
  },

  async recommend(restaurantId: string, prefs: Prefs): Promise<Pick[]> {
    if (MODE === "mock") {
      await tick(400);
      return samplePicks;
    }
    return live(`/api/recommend`, {
      method: "POST",
      body: JSON.stringify({ restaurantId, prefs })
    });
  },

  async getDish(id: string): Promise<Dish | null> {
    if (MODE === "mock") {
      await tick(150);
      return dishById(id) ?? null;
    }
    return live(`/api/dish/${id}`);
  },

  async submitFeedback(scanId: string, dishId: string, action: string, notes?: string) {
    if (MODE === "mock") {
      await tick();
      return { ok: true };
    }
    return live(`/api/feedback`, {
      method: "POST",
      body: JSON.stringify({ scanId, dishId, action, notes })
    });
  },

  async getProfile(): Promise<Profile> {
    if (MODE === "mock") {
      await tick();
      return sampleProfile;
    }
    return live(`/api/profile`);
  },

  async getGroup(code: string): Promise<Group> {
    if (MODE === "mock") {
      await tick();
      return sampleGroup;
    }
    return live(`/api/group/${code}`);
  }
};
