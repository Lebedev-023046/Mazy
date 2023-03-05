import User from "@/models/User";
import db from "@/utils/db";
import CredentialsProvider from "next-auth/providers/credentials";
import nextAuth from "next-auth";
import bcryptjs from "bcryptjs";

export default nextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (session?.id) session.user._id = token._id as string;
      if (session?.isAdmin) session.user.isAdmin = token.isAdmin as boolean;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},

      async authorize(credentials): Promise<any> {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        await db.connect();
        const user = await User.findOne({ email: email });
        await db.disconnect();
        if (user && bcryptjs.compareSync(password, user.password)) {
          return {
            _id: user.id,
            name: user.name,
            email: user.email,
            image: "i",
            isAdmin: user.isAdmin,
          };
        }
        return null;
      },
    }),
  ],
});
