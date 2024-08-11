import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function POST(req) {
    
    console.log('Environment variables:', {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
      });
    
      const { username, password, email, name } = await req.json()
    
      const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
    
      console.log('Database config:', dbConfig);
  
    try {
      const connection = await mysql.createConnection(dbConfig)
  
      // Check if username or email already exists
      const [existingUsers] = await connection.execute(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email]
      )
  
      if (existingUsers.length > 0) {
        await connection.end()
        return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 })
      }
  
      // Insert new user
      await connection.execute(
        'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)',
        [username, password, email, name]
      )
  
      await connection.end()
  
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
    }
  }