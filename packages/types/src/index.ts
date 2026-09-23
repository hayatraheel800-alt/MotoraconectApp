export type UserRole = "USER" | "BUYER" | "SELLER" | "DEALER" | "CONSULTANT" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
export type VehicleStatus = "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "RESERVED" | "SOLD" | "EXPIRED" | "REJECTED" | "SUSPENDED";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
export type DataProvenance = "DETECTED" | "INTERPRETED" | "USER_PROVIDED" | "ESTIMATED" | "UNVERIFIED";
export type ServiceResult<T> = { data: T; error: null } | { data: null; error: ServiceError };
export interface ServiceError { code: string; message: string; userMessage: string; }
export interface VehicleFilters { q?: string; make?: string; model?: string; city?: string; minPrice?: number; maxPrice?: number; minYear?: number; maxYear?: number; status?: VehicleStatus; limit?: number; offset?: number; }
export type Vehicle = import("./database").Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleImage = import("./database").Database["public"]["Tables"]["vehicle_images"]["Row"];
export type { Database } from "./database";