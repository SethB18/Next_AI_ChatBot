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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { 
  GoogleGenAI, 
  FunctionDeclaration, 
  Type, 
  Part,
  Content,
  GenerateContentParameters,
  FunctionCall,
} from '@google/genai';
// Assuming these two files exist and export the correct functions/data
import systemInstruction from "./system_instruction"; // Assumes this fetches/returns the system prompt string
import Book from "./book"; // Assumes this is the external booking method
import Slot from "@/fetch_data/fetch_slot";
// NOTE: For client-side use, ensure the API Key is prefixed with NEXT_PUBLIC_
// and placed in a .env.local file.
// The hardcoded key below is for demonstration only and should be replaced.
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

// console.log("✅ Gemini Key:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
// --- Types & Declarations ---

interface BookAppointmentArgs {
  patientName: string;
  doctorName: string;
  appointmentTime: string;
}

interface Message {
    role: 'user' | 'assistant' | 'error';
    text: string;
}

const bookAppointmentDeclaration: FunctionDeclaration = {
  name: "bookAppointment",
  description: "Books a doctor's appointment once the patient name, doctor's name, and desired time have been provided by the user.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      patientName: {
        type: Type.STRING,
        description: "The full name of the patient requesting the appointment."
      },
      doctorName: {
        type: Type.STRING,
        description: "The name of the doctor the patient wishes to see."
      },
      appointmentTime: {
        type: Type.STRING,
        description: "The preferred date and time for the appointment (e.g., 'Tomorrow at 10:00 AM' or 'Dec 1st at 3 PM')."
      },
    },
    required: ["patientName", "doctorName", "appointmentTime"],
  },
};

// --- Helper Functions (Your external methods) ---

const executeBookAppointment = (args: BookAppointmentArgs) => {
    // 1. Log to console and show alert (the "mini method" requested)
    // console.log("--- 🚨 APPOINTMENT BOOKING TRIGGERED 🚨 ---");
    // console.log(`✅ Appointment Confirmed for ${args.patientName}`);
    // console.log(`👤 Doctor: ${args.doctorName}`);
    // console.log(`⏰ Time: ${args.appointmentTime}`);
    // alert(`Appointment Confirmed for ${args.patientName} with Dr. ${args.doctorName} at ${args.appointmentTime}! (Check console)`);
    
    // 2. Call your external method (Assuming 'Book' is imported correctly)
    // NOTE: If 'Book' is async, you should await it here, but for simplicity, 
    // we'll run it separately or assume it's synchronous. We rely on the returned 
    // object for the model's text response.
    // handlBook(args.patientName, args.doctorName, args.appointmentTime); 

    // 3. Return a structured success message for the model
    return { status: "Success", message: "Appointment has been successfully booked." };
};

// --- Main Component ---
export default function ChatWidget() {
  const [instruction, setInstruction] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: "assistant", text: "👋 Hello! I am Mindstride Assistant, how can i help you today?" },
  ]);


  useEffect(() => {
    async function loadInstruction() {
      try {
        const data = await systemInstruction();
        setInstruction(data);
        
      } catch (error) {
        console.error("Error loading system instruction:", error);
      }
    }
    loadInstruction();
  }, []);

  // console.log("Whole---Instructions: ", instruction)
  // Ref and function for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Main message sending and function call handling logic
  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault(); // Prevent default form submission if called from a form
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    
    // 1. Immediately update the UI to show the user's message
    setChatHistory((prev) => [
        ...prev, 
        { role: "user", text: userMessage },
    ]);
    
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const config: GenerateContentParameters['config'] = {
            systemInstruction: instruction,
            tools: [{ functionDeclarations: [bookAppointmentDeclaration] }],
        };
        
        const model = 'gemini-2.5-flash';
        
        // 2. Map the current chat history to the API format (Contents)
        // Ensure we only map 'user' and 'assistant' roles to 'user' and 'model' respectively.
        let API_CONTENTS: Content[] = chatHistory
            .filter(msg => msg.role === 'user' || msg.role === 'assistant')
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
        
        // Add the current user message to the API payload.
        API_CONTENTS.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        // --- Start of Function Calling Loop ---
        let response = await ai.models.generateContent({ model, config, contents: API_CONTENTS });
        
        while (response.functionCalls && response.functionCalls.length > 0) {
            
            // Add a "processing" message to the UI
            setChatHistory((prev) => [...prev, { role: "assistant", text: "Processing appointment request..." }]);
            
            const functionCall: FunctionCall = response.functionCalls[0];
            const { name, args } = functionCall;

            // console.log(`Model requested to call function: ${name}`);

            let functionResult: any;
            
            // Execute the function locally (our booking method)
            if (name === 'bookAppointment') {
                // Safely parse and validate args which may be an object or a JSON string
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
                    functionResult = { status: 'Error', message: `Missing required fields: ${missingFields.join(', ')}` };
                  } else {
                    const typedArgs: BookAppointmentArgs = { patientName, doctorName, appointmentTime };
                    functionResult = executeBookAppointment(typedArgs);
                    
                    // Call external booking function (if needed, ensure it's handled asynchronously if necessary)
                    try {
                      await Book(typedArgs.patientName, typedArgs.doctorName, typedArgs.appointmentTime);
                    } catch (err) {
                      console.error('External Book call failed:', err);
                    }
                  }
                }
                
            } else {
                console.error(`Unknown function call: ${name}`);
                functionResult = { error: `Unknown function: ${name}` };
            }

            // 3. Prepare function response parts and update contents for the next API call
            const functionResponsePart: Part = {
                functionResponse: {
                    name: name,
                    response: functionResult,
                }
            };
            
            // Append the model's request turn and our function response turn
            API_CONTENTS = [
                ...API_CONTENTS,
                { role: 'model', parts: [{ functionCall: functionCall }] },
                { role: 'function', parts: [functionResponsePart] }
            ];

            // 4. Call the model again with the function result included
            response = await ai.models.generateContent({ model, config, contents: API_CONTENTS });
            
            // Remove the "processing" message from the UI before getting the final response
            setChatHistory((prev) => prev.slice(0, prev.length - 1));
        }
        
        // 5. Update chat with the final model response
                const assistantText = response.text ?? "[No response from model]";
                setChatHistory((prev) => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (error) {
        console.error("Failed to call Gemini API:", error);
        // Ensure we handle the state update safely on error
        setChatHistory((prev) => [...prev, { role: "error", text: "Oops! Could not connect to the AI service. Please check the console for details." }]);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  // Allows sending message by pressing Enter key
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
            <Typography fontWeight={600} variant="subtitle1">AI Assistant</Typography>
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
          {/* Input */}
          <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <IconButton
              color="primary"
              sx={{ ml: 1 }}
              onClick={handleSend}
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
          bgcolor: "#749ef9ff",
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
            src="/icons/mobileLogo.png" 
            alt="Chat"
            sx={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%"}}
        />
      </IconButton>
    </Box>
  );
}