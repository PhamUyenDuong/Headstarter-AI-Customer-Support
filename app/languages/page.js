'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Stack, Typography } from '@mui/material'

export default function LanguageSelection() {
  const [language, setLanguage] = useState('')
  const router = useRouter()

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
    // Store the selected language in local storage or pass it to the next page
    localStorage.setItem('language', lang)
    router.push('/') // Navigate to the chat page
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f4f4f9"
    >
      <Typography variant="h4" gutterBottom>
        Select Your Language
      </Typography>
      <Stack spacing={2}>
        <Button variant="contained" onClick={() => handleLanguageSelect('en')}>
          English
        </Button>
        <Button variant="contained" onClick={() => handleLanguageSelect('es')}>
          Spanish
        </Button>
        <Button variant="contained" onClick={() => handleLanguageSelect('fr')}>
          French
        </Button>
        {/* Add more languages as needed */}
      </Stack>
    </Box>
  )
}
