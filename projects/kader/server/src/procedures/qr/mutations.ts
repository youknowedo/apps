import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { userTable } from "../../lib/db/schema.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const mutations = {
    generateId: procedure.mutation(
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

            // Add a new QR ID to the user
            const qrId = crypto.getRandomValues(new Uint8Array(20));
            const hex_qr_id = Buffer.from(qrId).toString("hex");

            await db
                .update(userTable)
                .set({
                    hex_qr_id: hex_qr_id,
                })
                .where(eq(userTable.id, user.id));

            return {
                success: true,
                qr: hex_qr_id,
            };
        }
    ),
};
