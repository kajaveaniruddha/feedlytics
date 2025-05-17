import { usersTable } from "@/db/models/user";;
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";

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
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
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

// Singleton instance for the app lifetime
const bloom = new BloomFilter(10000, 5);

// Populate the Bloom filter on first request (simulate DB load)
let bloomInitialized = false;
async function ensureBloomPopulated() {
  if (!bloomInitialized) {
    const users = await db.select().from(usersTable).where(eq(usersTable.isVerified, true));
    users.forEach((user: any) => bloom.add(user.username));
    bloomInitialized = true;
  }
}

export async function GET(request: Request) {
  try {
    await ensureBloomPopulated();
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid query parameter. username must be lowercase, contain only letters and numbers, and have no spaces or special characters." }),
        { status: 400 }
      );
    }

    const { username } = result.data;
    const exists = bloom.contains(username);

    if (exists) {
      // Bloom filter says it may exist, check DB to confirm
      const existingVerifiedUser = await db
        .select()
        .from(usersTable)
        .where(and(eq(usersTable.username, username), eq(usersTable.isVerified, true)))
        .limit(1);
      if (existingVerifiedUser.length) {
        return new Response(
          JSON.stringify({ success: false, message: "Username is already taken." }),
          { status: 200 }
        );
      }
      // False positive in Bloom filter, username is actually unique
      return new Response(
        JSON.stringify({ success: true, message: "Username is unique (false positive in Bloom filter)" }),
        { status: 200 }
      );
    }

    // Bloom filter says definitely not present
    return new Response(
      JSON.stringify({ success: true, message: "Username is unique." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error checking username" }),
      { status: 500 }
    );
  }
}

