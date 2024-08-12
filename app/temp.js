'use client'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Box, Button, Stack, TextField, Typography, IconButton } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [language, setLanguage] = useState('en') // Default language is English

  // const languageGreetings = {
  //   en: "Hi, I'm Carl! I will be assisting you with any of your questions about our cars and dealership.",
  //   es: "Hola, soy Carl! Estaré ayudándote con cualquiera de tus preguntas sobre nuestros coches y concesionarios.",
  //   fr: "Salut, je suis Carl ! Je vous aiderai avec toutes vos questions sur nos voitures et notre concession."
  // }

  const languageGreetings = {
    en: "",
    es: "",
    fr: ""
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session) {
      const selectedLanguage = localStorage.getItem('language') || 'en'
      setLanguage(selectedLanguage)

      const initialMessage = languageGreetings[selectedLanguage] || languageGreetings['en']
      setMessages([
        { role: 'assistant', content: initialMessage, feedback: null },
      ])

      // Send prompt to use the selected language
      sendMessage(`Please answer all questions in ${selectedLanguage}. Now please give a 1 sentence introduction to the user`, true)
    }
  }, [status, session, router])

  const sendMessage = async (prompt, isSystemMessage = false) => {
    if (!isSystemMessage) {
      setMessages((messages) => [
        ...messages,
        { role: 'user', content: prompt || message },
        { role: 'assistant', content: '', feedback: null },
      ])
      setMessage('')
    }

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: isSystemMessage ? 'system' : 'user', content: prompt || message, language }]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          if (!lastMessage) return messages
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  const handleFeedback = (index, feedback) => {
    setMessages((messages) => 
      messages.map((message, i) => 
        i === index ? { ...message, feedback } : message
      )
    )
    if (feedback === 'dislike') {
      sendMessage("The user thinks your previous response could have been better. Please try again.", true);
    }
  }

  return(
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      height="100vh"
      bgcolor="#f4f4f9"
    >
      <Typography variant="h4" gutterBottom>
        Chat with Carl
      </Typography>
      <Stack
        direction={'column'}
        width={'100%'}
        maxWidth={'400px'}
        height={'500px'}
        border={'1px solid #ddd'}
        borderRadius={2}
        bgcolor="white"
        p={2}
        spacing={2}
        boxShadow={2}
      >
        <Stack 
          direction={'column'} 
          spacing={2} 
          flexGrow={1} 
          overflow={'auto'} 
          maxHeight={'100%'}
          sx={{ 
            backgroundColor: '#f9f9f9', 
            borderRadius: 2,
            p: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              display={'flex'} 
              flexDirection={'column'}
              alignItems={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box 
                bgcolor={message.role === 'assistant' ? '#007bff' : '#808080'} 
                color='white'
                borderRadius={12}
                p={2}
                maxWidth={'80%'}
              >
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </Box>
              {message.role === 'assistant' && (
                <Stack direction="row" spacing={1} mt={1}>
                  <IconButton 
                    onClick={() => handleFeedback(index, 'like')}
                    color={message.feedback === 'like' ? 'primary' : 'default'}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleFeedback(index, 'dislike')}
                    color={message.feedback === 'dislike' ? 'primary' : 'default'}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={1}>
          <TextField
            label='Your Message'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button 
            variant="contained" 
            onClick={() => sendMessage()}
            sx={{ bgcolor: 'primary.main', color: 'white' }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
      <Button 
        variant="text" 
        onClick={() => signOut()}
        sx={{ mt: 2, color: 'primary.main' }}
      >
        Sign Out
      </Button>
    </Box>
  )
}
