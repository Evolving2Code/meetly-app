import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-utils";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidTimezone } from "@/lib/scheduling/timezones";
import { normalizeDisplayName, validateDisplayName } from "@/lib/validation/profile";
import { normalizeUsername, validateUsername } from "@/lib/validation/username";
import { isValidBrandColor, normalizeBrandColor } from "@/lib/branding/colors";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function avatarExtension(contentType: string) {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return null;
  }
}

function getAvatarPublicUrl(userId: string, extension: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/${AVATAR_BUCKET}/${userId}/avatar.${extension}`;
}

async function removeStoredAvatars(userId: string) {
  const admin = createAdminClient();
  const { data: files } = await admin.storage.from(AVATAR_BUCKET).list(userId);

  if (!files?.length) {
    return;
  }

  const paths = files.map((file) => `${userId}/${file.name}`);
  await admin.storage.from(AVATAR_BUCKET).remove(paths);
}

export async function GET() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, username, timezone, avatar_url, brand_color")
    .eq("id", user!.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...profile,
    email: user!.email,
  });
}

export async function PATCH(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const body = await request.json();
  const updates: {
    timezone?: string;
    username?: string;
    name?: string;
    avatar_url?: string | null;
    brand_color?: string;
  } = {};

  if (body.timezone !== undefined) {
    const timezone = String(body.timezone);

    if (!isValidTimezone(timezone)) {
      return NextResponse.json({ error: "Invalid timezone." }, { status: 400 });
    }

    updates.timezone = timezone;
  }

  if (body.username !== undefined) {
    const usernameError = validateUsername(String(body.username));
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    updates.username = normalizeUsername(String(body.username));
  }

  if (body.name !== undefined) {
    const nameError = validateDisplayName(String(body.name));
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    updates.name = normalizeDisplayName(String(body.name));
  }

  if (body.avatar_url === null) {
    await removeStoredAvatars(user!.id);
    updates.avatar_url = null;
  }

  if (body.brand_color !== undefined) {
    const brandColor = String(body.brand_color);

    if (!isValidBrandColor(brandColor)) {
      return NextResponse.json({ error: "Brand color must be a valid hex code." }, { status: 400 });
    }

    updates.brand_color = normalizeBrandColor(brandColor);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user!.id)
    .select("id, name, username, timezone, avatar_url, brand_color")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...profile,
    email: user!.email,
  });
}

export async function POST(request: NextRequest) {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  const formData = await request.formData();
  const file = formData.get("avatar");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Avatar file is required." }, { status: 400 });
  }

  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Avatar must be a JPEG, PNG, WebP, or GIF image." },
      { status: 400 },
    );
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return NextResponse.json({ error: "Avatar must be 2 MB or smaller." }, { status: 400 });
  }

  const extension = avatarExtension(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const admin = createAdminClient();
  await removeStoredAvatars(user!.id);

  const filePath = `${user!.id}/avatar.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage.from(AVATAR_BUCKET).upload(filePath, buffer, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const avatarUrl = `${getAvatarPublicUrl(user!.id, extension)}?v=${Date.now()}`;

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user!.id)
    .select("id, name, username, timezone, avatar_url, brand_color")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...profile,
    email: user!.email,
  });
}

export async function DELETE() {
  const { user, supabase, response } = await requireAuth();
  if (response) return response;

  await removeStoredAvatars(user!.id);

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user!.id)
    .select("id, name, username, timezone, avatar_url, brand_color")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...profile,
    email: user!.email,
  });
}
