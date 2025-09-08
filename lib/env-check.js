// File: lib/env-check.js

const MONGO_URI = process.env.MONGO_URI;

// This log is our primary goal.
console.log(`--- [ENV CHECK] The value of MONGO_URI is: >${MONGO_URI}< ---`);

if (!MONGO_URI || !MONGO_URI.startsWith('mongodb')) {
  // If the variable is bad, we throw our own custom error.
  throw new Error(`
    ===========================================================
    CRITICAL ENV ERROR: MONGO_URI IS NOT VALID.
    Value: >${MONGO_URI}<
    This is the reason for the crash. Check Vercel dashboard.
    ===========================================================
  `);
}