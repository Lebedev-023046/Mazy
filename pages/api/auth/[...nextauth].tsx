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
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id as string;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin as boolean;
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
            _id: user._id,
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
