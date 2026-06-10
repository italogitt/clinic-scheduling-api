import * as argon from "argon2";
import type { BigIntOptions } from "node:fs";

const ARGON2_CONFIG: argon.Options = {
  type: argon.argon2id,
  memoryCost: 131072, //128MB
  timeCost: 3,
  parallelism: 4,
  hashLength: 32,
};

export async function hashPassword(password: string): Promise<string> {
  return argon.hash(password, ARGON2_CONFIG);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon.verify(hash, password);
}
