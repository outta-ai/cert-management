import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      googleId: string;
    };
  }

  interface User {
    id: string;
    name: string;
    googleId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    googleId: string;
  }
}
