"use client";
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Divider,
  CircularProgress,
  Button, 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import getSystemInstruction from "./system";
import callApiWithBackoff from "./callBackoff";
import RunningClock from "../clock/running_clock";
import Book from "./book";

interface BookAppointmentArgs {
  patientName: string;
  doctorName: string;
  appointmentTime: string;
}

interface Message {
  role: 'user' | 'assistant' | 'error';
  text: string;
}

const bookAppointmentDeclaration: any = { 
  name: "bookAppointment",
  description: "Books a doctor's appointment once the patient name, doctor's name, and desired time have been provided by the user.",
  parameters: {
    type: "OBJECT",
    properties: {
      patientName: {
        type: "STRING",
        description: "The full name of the patient requesting the appointment."
      },
      doctorName: {
        type: "STRING",
        description: "The name of the doctor the patient wishes to see."
      },
      appointmentTime: {
        type: "STRING",
        description: "The preferred date and time for the appointment (e.g., 'Tomorrow at 10:00 AM' or 'Dec 1st at 3 PM')."
      },
    },
    required: ["patientName", "doctorName", "appointmentTime"],
  },
};

export default function ChatHead() {
  const [instruction, setInstruction] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [interactiveOptions, setInteractiveOptions] = useState<string[] | null>(null);
  
  const [chatHistory, setChatHistory] = useState<Message[]>([
<<<<<<< HEAD
    { role: "assistant", text: "👋 Hello! I am Martha Assistant, how can i help you today?" },
=======
    { role: "assistant", text: "👋 Hello! I am Martha, how can i help you today?" },
>>>>>>> b4fb0982dafc20954f4d1e78f984d794be0c7960
  ]);


  useEffect(() => {
    async function loadInstruction() {
      try {

        const data = await getSystemInstruction();

        // console.log(data)
        setInstruction(data);
        
      } catch (error) {
        console.error("Error loading system instruction:", error);
      }
    }
    loadInstruction();
  }, []);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (!isLoading) {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }
}, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading, interactiveOptions]);

  const handleSelection = (selection: string) => {
    setInteractiveOptions(null); 

    const selectionMessage = selection; 

    setChatHistory((prev) => [
      ...prev, 
      { role: "user", text: selectionMessage },
    ]);
    
    setMessage(""); 
    setTimeout(() => {
        handleSend(undefined, selectionMessage);
    }, 0);
  };


  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (e?: FormEvent, messageOverride?: string) => {
    e?.preventDefault(); 
    
    const userMessage = messageOverride || message.trim();

    if (!userMessage || isLoading) return;
    
    if (!messageOverride) {
      setMessage("");

      setChatHistory((prev) => [
          ...prev, 
          { role: "user", text: userMessage },
      ]);
    } else {

       setMessage(""); 
    }
    
    setIsLoading(true);
    setInteractiveOptions(null);

    try {

        const systemInstruction: any = { parts: [{ text: instruction }] }; 
        const tools: any = [{ functionDeclarations: [bookAppointmentDeclaration] }];

        let API_CONTENTS: any[] = chatHistory
            .filter(msg => msg.role === 'user' || msg.role === 'assistant')
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
        
        API_CONTENTS.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        console.log("API CONTENTS:", API_CONTENTS);
        
        let apiPayload: any = { 
            contents: API_CONTENTS, 
            systemInstruction: systemInstruction, // TOP LEVEL
            tools: tools, // TOP LEVEL
        };
        
        let result = await callApiWithBackoff(apiPayload);
        let candidate = result?.candidates?.[0];
        
        let functionCalls = candidate?.content?.parts
            ?.filter((part: any) => part.functionCall)
            .map((part: any) => part.functionCall);
        
        while (functionCalls && functionCalls.length > 0) {
            
            setChatHistory((prev) => [...prev, { role: "assistant", text: "Processing appointment request..." }]);
            
            const functionCall: any = functionCalls[0];
            const { name, args } = functionCall;

<<<<<<< HEAD
            let functionResult: any;
            
=======
            // console.log(`Model requested to call function: ${name}`)
            let functionResult: any;
            // Execute the function locally (our booking method)
>>>>>>> b4fb0982dafc20954f4d1e78f984d794be0c7960
            if (name === 'bookAppointment') {
                let parsedArgs: any = args;
                if (typeof parsedArgs === 'string') {
                  try {
                    parsedArgs = JSON.parse(parsedArgs);
                  } catch (err) {
                    console.error('Failed to parse function args JSON:', err);
                    parsedArgs = undefined;
                  }
                }

                if (!parsedArgs || typeof parsedArgs !== 'object') {
                  console.error('Invalid or missing arguments for bookAppointment:', parsedArgs);
                  functionResult = { status: 'Error', message: 'Invalid or missing arguments for bookAppointment' };
                } else {

                  const patientName = String(parsedArgs.patientName ?? '').trim();
                  const doctorName = String(parsedArgs.doctorName ?? '').trim();
                  const appointmentTime = String(parsedArgs.appointmentTime ?? '').trim();

                  const missingFields = [];
                  if (!patientName) missingFields.push('patientName');
                  if (!doctorName) missingFields.push('doctorName');
                  if (!appointmentTime) missingFields.push('appointmentTime');

                  if (missingFields.length > 0) {
                    console.error('Missing required bookAppointment fields:', missingFields);
                    functionResult = { status: 'Error', message: `Missing required fields: ${missingFields.join(', ')}. Please provide all required information.` };
                  } else {
                    
                    try {

                      await Book(patientName, doctorName, appointmentTime);
                      functionResult = { 
                          status: "Success", 
                          message: `Appointment confirmed for ${patientName} with Dr. ${doctorName} at ${appointmentTime}.` 
                      };
                      console.log("--- ✅ APPOINTMENT BOOKING SUCCESSFUL ✅ ---");
  
                      alert(`Appointment Confirmed for ${patientName} with Dr. ${doctorName} at ${appointmentTime}!`);
                    } catch (err: any) {
                      const errorMessage = err.message || 'Unknown server error during booking.';
                      console.error('External Book call failed:', errorMessage);
                      functionResult = { 
                          status: 'Error', 
                          message: `The external booking system failed. Reason: ${errorMessage}.` 
                      };
                      alert(`Booking Failed: ${errorMessage}`);
                    }
                  }
                }
                
            } else {
                console.error(`Unknown function call: ${name}`);
                functionResult = { error: `Unknown function: ${name}` };
            }
            const functionResponsePart: any = {
                functionResponse: {
                    name: name,
                    response: { result: functionResult }, 
                }
            };
  
            API_CONTENTS = [
                ...API_CONTENTS,
                { role: 'model', parts: [{ functionCall: functionCall }] }, 
                { role: 'function', parts: [functionResponsePart] } 
            ];

            apiPayload = { 
                contents: API_CONTENTS, 
                systemInstruction: systemInstruction, // TOP LEVEL
                tools: tools, // TOP LEVEL
            };
            result = await callApiWithBackoff(apiPayload);
            candidate = result?.candidates?.[0];
        
            functionCalls = candidate?.content?.parts
                ?.filter((part: any) => part.functionCall)
                .map((part: any) => part.functionCall);
            
            
            setChatHistory((prev) => prev.slice(0, prev.length - 1));
        }
        
        const finalResponseText = candidate?.content?.parts?.[0]?.text ?? "Can you please clarify again?";
        const optionsRegex = /\[START_OPTIONS\](.*?)\[END_OPTIONS\]/s;
        const match = finalResponseText.match(optionsRegex);
        
        if (match && match[1]) {
          const options = match[1].split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          const cleanText = finalResponseText.replace(optionsRegex, '').trim();
          
          setInteractiveOptions(options);
          setChatHistory((prev) => [...prev, { role: 'assistant', text: cleanText }]);

        } else {
          setInteractiveOptions(null);
          setChatHistory((prev) => [...prev, { role: 'assistant', text: finalResponseText }]);
        }

    } catch (error) {
      console.error("Failed to call Gemini API:", error);

      setChatHistory((prev) => [...prev, { role: "error", text: "Oops! Could not connect to the AI service. Please check the console for details." }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
    
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      {/* Chat Box */}
      {open && (
        <Paper
          elevation={8}
          sx={{
            width: 320,
            height: 520,
            mb: 2,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#2196f3", // primary.main color
              color: "white",
              p: 1.5,
            }}
          >
<<<<<<< HEAD
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1}}>
              <Typography fontWeight={600} variant="subtitle1">Martha Assistant</Typography>
              <RunningClock/>
            </Box>
=======
            <Typography fontWeight={600} variant="subtitle1">Martha Assistant</Typography>
>>>>>>> b4fb0982dafc20954f4d1e78f984d794be0c7960
            <IconButton color="inherit" size="small" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
            {chatHistory.map((msg, index) => {
              const isUser = msg.role === 'user';
              const isError = msg.role === 'error';
              return (
                <Typography 
                  component="div" 
                  key={index} 
                  sx={{ mb: 1, display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',fontSize: '5px' }} 
                  align={isUser ? 'right' : 'left'}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      p: 1,
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      boxShadow: 1,
                      bgcolor: isUser ? '#60A5FA' : isError ? '#FEE2E2' : '#F3F4F6',
                      color: isUser ? 'white' : isError ? '#EF4444' : '#1F2937',
                      border: isError ? '1px solid #EF4444' : 'none',
                    }}
                  >
                    {msg.text}
                  </Box>
                </Typography>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <Typography component="div" sx={{ mb: 1, display: 'flex', justifyContent: 'flex-start' }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    bgcolor: '#F3F4F6',
                    color: '#1F2937',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress size={16} sx={{ mr: 1, color: '#9CA3AF' }} />
                  Thinking...
                </Box>
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Divider />
          
          {/* 🚨 INTERACTIVE BUTTONS SECTION 🚨 */}
          {interactiveOptions && interactiveOptions.length > 0 && (
            <Box sx={{ p: 1, borderTop: '1px solid #ddd', bgcolor: '#f0f4ff', maxHeight: '150px', overflowY: 'auto' }}>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                    Select Option:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {interactiveOptions.map((option, index) => (
                      <Button
                          key={index}
                          variant="contained"
                          size="small"
                          sx={{ 
                              bgcolor: '#4C6EF5', 
                              '&:hover': { bgcolor: '#364FC7' }, 
                              textTransform: 'none',
                              borderRadius: 2,
                              boxShadow: 'none',
                              fontSize: '0.8rem'
                          }}
                          onClick={() => handleSelection(option)}
                          disabled={isLoading}
                      >
                          {option}
                      </Button>
                  ))}
                </Box>
            </Box>
          )}

          {/* Input */}
          <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              size="small"
              fullWidth
              placeholder={interactiveOptions ? "Or type a custom response..." : "Type a message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <IconButton
              color="primary"
              sx={{ ml: 1 }}
              onClick={() => handleSend()}
              disabled={isLoading || !message.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Floating Button */}
      <IconButton
        color="primary"
        sx={{
          bgcolor: "#a1adffff",
          color: "white",
          "&:hover": { bgcolor: "#1D4ED8" },
          boxShadow: 4,
          width: 56,
          height: 56,
          borderRadius: "50%",
        }}
        onClick={() => setOpen(!open)}
      >
        <Box
            component="img"
            src="/icons/mindStride_AI_logo.png" 
            alt="Chat"
            sx={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%"}}
        />
      </IconButton>
    </Box>
  );
}
