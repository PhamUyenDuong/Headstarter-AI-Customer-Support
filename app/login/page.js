'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Box, Button, TextField, Typography } from '@mui/material'
import Link from 'next/link'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })
    if (result.ok) {
      router.push('/languages')
    } else {
      // Handle error
      alert('Login failed')
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
        Login
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </form>

        <Typography variant="body2" style={{ marginTop: '1rem' }}>
            Don't have an account? <Link href="/signup">Sign up</Link>
        </Typography>
    </Box>
  )
}