import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { userTable } from "../../lib/db/schema.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const queries = {
    validate: procedure
        .input(z.string())
        .query(
            async ({ ctx, input }): Promise<ResponseData<{ qr: string }>> => {
                if (!ctx.sessionId)
                    return {
                        success: false,
                        error: "Unauthenticated",
                    };

                const { session, user } = await lucia.validateSession(
                    ctx.sessionId
                );
                if (!session)
                    return {
                        success: false,
                        error: "Unauthenticated",
                    };

                const { hex_qr_id } = (
                    await db
                        .select({
                            hex_qr_id: userTable.hex_qr_id,
                        })
                        .from(userTable)
                        .where(eq(userTable.id, user.id))
                )[0];

                if (hex_qr_id !== input)
                    return {
                        success: false,
                        error: "Invalid QR ID",
                    };

                return {
                    success: true,
                };
            }
        ),
};
