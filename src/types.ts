export interface LocationInfo {
  name: string;
  city: string;
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export interface CampingTrip {
  id: string;
  name: string;
  date: string;
  location: LocationInfo;
  photos: string[];
  expenses: ExpenseItem[]; // Changed to array
  notes: string;
  rating: number;
  weather?: string;
  campType?: string;
  facilities?: string[];
  pitchArea?: string;
  pros?: string[];
  cons?: string[];
  gearList?: GearItem[];
  shoppingList?: ShoppingItem[];
}

export interface GearItem {
  id: string;
  name: string;
  assignee: string;
  isCompleted: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  buyer: string;
  category: string;
  isPurchased: boolean;
}
