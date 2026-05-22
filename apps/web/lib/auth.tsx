"use client";

// Auth is handled by Clerk. Use Clerk hooks directly:
//   useUser()    → user object
//   useAuth()    → { getToken, isSignedIn, userId }
//   useClerk()   → { signOut }
//
// To get a JWT for backend requests:
//   const { getToken } = useAuth();
//   const token = await getToken();
//   fetch(url, { headers: { Authorization: `Bearer ${token}` } })

export { useAuth, useUser, useClerk } from "@clerk/nextjs";
