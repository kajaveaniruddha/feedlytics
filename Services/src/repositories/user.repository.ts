import { db } from "../db/db";
import { usersTable } from "../db/models/user";

export const userRepository = {
  async findAllWithTier() {
    return db
      .select({ id: usersTable.id, userTier: usersTable.userTier })
      .from(usersTable);
  },
};
