// lib/types.ts

export interface Selling {
    id: number;
    weight: number;
    rate: number;
    total: number;
    type: "BUY" | "SELL";
    createdAt: string;
    itemId: number;
    userId: number;
    item: {
        name: string ;
    };
}

export interface DashboardData {
    summary: {
        totalBuy: number;
        totalSell: number;
        profit: number;
    };
    sellings: Selling[];
}

// types.ts


export type TransactionType = "BUY" | "SELL";


export interface SaleCreateData {
    productId: number;
    weight: number;
    rate: number;
    total: number;
    type: "BUY" | "SELL";
}


export interface PreferenceUpdateRequest {
    itemId: number;
    userId: number;
}


export interface ItemCreateRequest {
    name: string;
    rate: number;
    userId?: number;
}

export interface ItemUpdateRequest {
    id: number;
    name: string;
    rate: number;
}
// lib/types.ts

// Base Item interface (for database items)
export interface Item {
  id: number;
  name: string;
  rate: number;
  userId: number;
  preference: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating new items (matches Prisma's expected input)
export interface ItemCreateInput {
  name: string;
  rate: number;
  userId: number;
  preference?: boolean;
}

// For updating existing items
export interface ItemUpdateInput {
  name?: string;
  rate?: number;
  preference?: boolean;
}

// For API request bodies
export interface ItemApiRequest {
  id?: number;
  name?: string;
  rate?: number;
  preference?: boolean;
}

// Authentication types
export interface LoginRequest {
  name: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface User {
  id: number;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Signup types
export interface SignupRequest {
  name: string;
  email?: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email?: string | null ;
  };
}

export interface AuthError {
  error: string;
}