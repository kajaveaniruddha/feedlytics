import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { userRepository } from "@/repositories/user.repository";
import { successResponse, errorResponse } from "@/lib/api-response";
import { withMetrics } from "@/lib/metrics";

const UsernameQuerySchema = z.object({ username: usernameValidation });

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
      hash = (hash << 5) + hash + str.charCodeAt(i);
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
    const users = await userRepository.findAllVerified();
    users.forEach((user) => bloom.add(user.username));
    bloomInitialized = true;
  }
}

async function handleGET(request: Request) {
  try {
    await ensureBloomPopulated();
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      return errorResponse(
        "Invalid query parameter. username must be lowercase, contain only letters and numbers, and have no spaces or special characters.",
        400
      );
    }

    const { username } = result.data;
    const exists = bloom.contains(username);

    if (exists) {
      const existingUser = await userRepository.findVerifiedByUsername(username);
      if (existingUser) {
        return errorResponse("Username is already taken.", 200);
      }
      return successResponse({
        message: "Username is unique (false positive in Bloom filter)",
      });
    }

    return successResponse({ message: "Username is unique." });
  } catch (error) {
    console.error("Error checking username", error);
    return errorResponse("Error checking username", 500);
  }
}

export const GET = withMetrics(handleGET, "/api/check-username-unique");
