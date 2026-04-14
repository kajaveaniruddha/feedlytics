import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { and, eq } from "drizzle-orm";
import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";

const UsernameQuerySchema = z.object({ username: usernameValidation });

// Simple in-memory Bloom filter implementation
class BloomFilter {
  private size: number;
  private hashes: number;
  private bitArray: Uint8Array;

  constructor(size = 1000, hashes = 3) {
    this.size = size;
    this.hashes = hashes;
    this.bitArray = new Uint8Array(size);
  }

  private hash(str: string, seed: number): number {
    let hash = 5381 + seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str?.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % this.size;
  }

  add(str: string) {
    for (let i = 0; i < this.hashes; i++) {
      const idx = this.hash(str, i);
      this.bitArray[idx] = 1;
    }
  }

  contains(str: string): boolean {
    for (let i = 0; i < this.hashes; i++) {
      const idx = this.hash(str, i);
      if (this.bitArray[idx] === 0) return false;
    }
    return true;
  }
}

const bloom = new BloomFilter(10000, 5);
let bloomInitialized = false;

async function ensureBloomPopulated() {
  if (!bloomInitialized) {
    const users = await db.select().from(usersTable).where(eq(usersTable.isVerified, true));
    users.forEach((user: any) => bloom.add(user.username));
    bloomInitialized = true;
  }
}

const handleGET = createHandler(async (request: Request) => {
  await ensureBloomPopulated();
  const { searchParams } = new URL(request.url);
  const queryParam = { username: searchParams.get("username") };

  const result = UsernameQuerySchema.safeParse(queryParam);
  if (!result.success) {
    throw ApiError.badRequest(
      "Invalid query parameter. username must be lowercase, contain only letters and numbers, and have no spaces or special characters."
    );
  }

  const { username } = result.data;
  const exists = bloom.contains(username);

  if (exists) {
    const existingVerifiedUser = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.username, username), eq(usersTable.isVerified, true)))
      .limit(1);

    if (existingVerifiedUser.length) {
      return successResponse({ success: false, message: "Username is already taken." });
    }

    return successResponse({ message: "Username is unique (false positive in Bloom filter)" });
  }

  return successResponse({ message: "Username is unique." });
});

export const GET = withMetrics(handleGET, "/api/check-username-unique");
