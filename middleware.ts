import { authMiddleware } from "@clerk/nextjs";

// To make sure that all api routes can be triggered.
export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
