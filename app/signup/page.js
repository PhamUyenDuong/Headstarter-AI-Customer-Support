'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, TextField, Typography } from '@mui/material'
import Link from 'next/link'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, name }),
    })
  
    const data = await response.json()
  
    if (response.ok) {
      router.push('/login')
    } else {
      // Handle error
      alert(`Signup failed: ${data.error}${data.details ? ` - ${data.details}` : ''}`)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </Box>
      </form>

     <Typography variant="body2" style={{ marginTop: '1rem' }}>
        Already have an account? <Link href="/login">Log in</Link>
     </Typography>

    </Box>
  )
}