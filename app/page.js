'use client'
import Image from "next/image";
import React, {useState} from "react";
import {Box, Button, Stack, TextField} from '@mui/material'
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi, I'm Carl! I will be assisting you with any of your questions about our cars and dealership.`
  },
])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])
  
    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()  // Get a reader to read the response body
      const decoder = new TextDecoder()  // Create a decoder to decode the response text
  
      let result = ''
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ]
        })
        return reader.read().then(processText)  // Continue reading the next chunk of the response
      })
    })
  }

  return(
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center"
      alignItems="center"
      bgcolor="#f4f4f9" // Light background for the whole page
    >
      <Stack
        direction={'column'}
        width={'1000px'}
        height={'600px'}
        borderRadius={4}
        boxShadow={3} // Add shadow for depth
        bgcolor="white"
        p={3}
        spacing={3}
      >
        <Stack 
          direction={'column'} 
          spacing={2} 
          flexGrow={1} 
          overflow={'auto'} 
          maxHeight={'100%'}
          p={2}
          sx={{ 
            backgroundColor: '#e9ecef', // Slightly darker background for messages area
            borderRadius: 2,
          }}
        >
          {
            messages.map((message, index) => (
              <Box 
                key={index} 
                display={'flex'} 
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
                mb={1} // Margin bottom for spacing between messages
              >
                <Box 
                  bgcolor={
                    message.role === 'assistant' ? '#808080' : '#007bff'
                  } 
                  color='white'
                  borderRadius={6}
                  p={3}
                  maxWidth={'70%'} // Limit the width of the message bubbles
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label='Your Message'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}