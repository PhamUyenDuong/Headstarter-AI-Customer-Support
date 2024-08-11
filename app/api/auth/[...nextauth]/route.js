import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import mysql from 'mysql2/promise'

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials.username || !credentials.password) {
          return null
        }

        try {
          // Create a connection to the database
          const connection = await mysql.createConnection(dbConfig)

          // Query the database for the user
          const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [credentials.username]
          )

          // Close the database connection
          await connection.end()

          if (rows.length > 0) {
            const user = rows[0]
            if (user.password === credentials.password) {
              return { id: user.id, name: user.name, email: user.email }
            }
          }

          return null
        } catch (error) {
          console.error('Database error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }