console.log(`--- Inngest API route loaded. MONGO_URI is: ${process.env.MONGO_URI} ---`);
import '@/lib/env-check.js';
import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],         
});