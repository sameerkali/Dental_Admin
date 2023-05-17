import GoogleProvider from "next-auth/providers/google"; // import GoogleProvider from next-auth/providers/google module
import NextAuth, { getServerSession } from "next-auth"; // import NextAuth and getServerSession from next-auth module
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // import MongoDBAdapter from @next-auth/mongodb-adapter module
import clientPromise from "@/lib/mongodb"; // import clientPromise from a module with path '@/lib/mongodb'

const adminEmails = ["s.faridi007@gmail.com"]; // define an array of admin emails

export const authOptions = {
  secret: process.env.JWT_SECRET, // set secret from environment variable 
  providers: [
    GoogleProvider({
      // add Google provider with client ID and secret from environment variables
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  adapter: MongoDBAdapter(clientPromise), // set MongoDB adapter with clientPromise
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        // check if the user email is in adminEmails array
        return session; // return the session if the user is an admin
      } else {
        return false; // return false if the user is not an admin
      }
    }
  }
};

export default NextAuth(authOptions); // export NextAuth with authOptions

export async function isAdminRequest(req, res) {
  // define an async function isAdminRequest with req and res parameters
  const session = await getServerSession(req, res, authOptions); // get the server session using req, res, and authOptions
  if (!adminEmails.includes(session?.user?.email)) {
    // check if the user email is in adminEmails array
    res.status(401); // set status to 401 if the user is not an admin
    res.end(); // end the response
    throw "not an admin"; // throw an error if the user is not an admin
  }
}
