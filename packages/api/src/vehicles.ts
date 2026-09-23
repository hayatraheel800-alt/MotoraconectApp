import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ServiceResult, Vehicle, VehicleFilters, VehicleImage } from "@motoraconect/types";

type Client = SupabaseClient<Database>;
type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];

function failure(code: string, message: string, userMessage = "Something went wrong. Please try again."): ServiceResult<never> {
  return { data: null, error: { code, message, userMessage } };
}

export async function listVehicles(client: Client, filters: VehicleFilters = {}): Promise<ServiceResult<Vehicle[]>> {
  const limit = Math.min(Math.max(filters.limit ?? 20, 1), 50);
  const offset = Math.max(filters.offset ?? 0, 0);
  let query = client.from("vehicles").select("*").order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (filters.status) query = query.eq("status", filters.status);
  else query = query.eq("status", "ACTIVE");
  if (filters.make) query = query.ilike("make", filters.make);
  if (filters.model) query = query.ilike("model", filters.model);
  if (filters.city) query = query.ilike("city", filters.city);
  if (filters.minPrice !== undefined) query = query.gte("price_amount", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price_amount", filters.maxPrice);
  if (filters.minYear !== undefined) query = query.gte("year", filters.minYear);
  if (filters.maxYear !== undefined) query = query.lte("year", filters.maxYear);
  if (filters.q?.trim()) query = query.textSearch("search_document", filters.q.trim(), { type: "websearch" });
  const { data, error } = await query;
  return error ? failure(error.code ?? "VEHICLE_LIST_FAILED", error.message) : { data: data as Vehicle[], error: null };
}

export async function getVehicle(client: Client, id: string): Promise<ServiceResult<Vehicle>> {
  const { data, error } = await client.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (error) return failure(error.code ?? "VEHICLE_GET_FAILED", error.message);
  if (!data) return failure("VEHICLE_NOT_FOUND", "Vehicle not found.", "This vehicle is no longer available.");
  return { data: data as Vehicle, error: null };
}

export async function listVehicleImages(client: Client, vehicleId: string): Promise<ServiceResult<VehicleImage[]>> {
  const { data, error } = await client.from("vehicle_images").select("*").eq("vehicle_id", vehicleId).order("sort_order");
  return error ? failure(error.code ?? "VEHICLE_IMAGES_FAILED", error.message) : { data: data as VehicleImage[], error: null };
}

export async function createVehicle(client: Client, input: Omit<VehicleInsert, "seller_id">): Promise<ServiceResult<Vehicle>> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return failure("AUTH_REQUIRED", userError?.message ?? "No authenticated user.", "Please sign in to create a listing.");
  const payload: VehicleInsert = { ...input, seller_id: userData.user.id, status: input.status ?? "DRAFT" };
  const { data, error } = await client.from("vehicles").insert(payload).select("*").single();
  return error ? failure(error.code ?? "VEHICLE_CREATE_FAILED", error.message, "We couldn't save your listing.") : { data: data as Vehicle, error: null };
}

export async function updateVehicle(client: Client, id: string, input: VehicleUpdate): Promise<ServiceResult<Vehicle>> {
  const { data, error } = await client.from("vehicles").update(input).eq("id", id).select("*").single();
  return error ? failure(error.code ?? "VEHICLE_UPDATE_FAILED", error.message, "We couldn't update your listing.") : { data: data as Vehicle, error: null };
}

export async function submitVehicle(client: Client, id: string): Promise<ServiceResult<Vehicle>> {
  return updateVehicle(client, id, { status: "PENDING_REVIEW" });
}

export async function deleteVehicle(client: Client, id: string): Promise<ServiceResult<null>> {
  const { error } = await client.from("vehicles").delete().eq("id", id);
  return error ? failure(error.code ?? "VEHICLE_DELETE_FAILED", error.message, "We couldn't delete this draft.") : { data: null, error: null };
}

export async function createVehicleImage(client: Client, image: VehicleInsert extends never ? never : Database["public"]["Tables"]["vehicle_images"]["Insert"]): Promise<ServiceResult<VehicleImage>> {
  const { data, error } = await client.from("vehicle_images").insert(image).select("*").single();
  return error ? failure(error.code ?? "VEHICLE_IMAGE_CREATE_FAILED", error.message) : { data: data as VehicleImage, error: null };
}

export async function createVehicleImageSignedUrl(client: Client, storagePath: string, expiresIn = 3600): Promise<ServiceResult<string>> {
  const { data, error } = await client.storage.from("vehicle-images").createSignedUrl(storagePath, expiresIn);
  return error ? failure("VEHICLE_IMAGE_URL_FAILED", error.message) : { data: data.signedUrl, error: null };
}

export async function uploadVehicleImage(
  client: Client,
  vehicleId: string,
  body: ArrayBuffer,
  contentType: string,
  extension: string,
  sortOrder: number,
  altText?: string | null,
): Promise<ServiceResult<VehicleImage>> {
  const normalizedExtension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const path = `${vehicleId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${normalizedExtension}`;
  const upload = await client.storage.from("vehicle-images").upload(path, body, {
    contentType,
    upsert: false,
  });
  if (upload.error) return failure("VEHICLE_IMAGE_UPLOAD_FAILED", upload.error.message, "We couldn't upload that photo.");

  const record = await createVehicleImage(client, {
    vehicle_id: vehicleId,
    storage_path: upload.data.path,
    sort_order: sortOrder,
    alt_text: altText ?? null,
  });
  if (record.error) {
    await client.storage.from("vehicle-images").remove([upload.data.path]);
    return record;
  }
  return record;
}