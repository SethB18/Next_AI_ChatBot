import { GoogleGenAI } from '@google/genai';
import * as readline from 'readline';

// --- MAIN EXECUTION FUNCTION ---
async function runTest() {
  // 1. Check for API Key in environment variables
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY environment variable is not set.");
    console.error("Please set it using: export GEMINI_API_KEY=\"YOUR_KEY\"");
    return;
  }

  try {
    // 2. Initialize the client. It securely uses the key from process.env.GEMINI_API_KEY
    const ai = new GoogleGenAI({});

    console.log("Client initialized successfully. Sending prompt to Gemini...");
    
    // 3. Define the prompt and configuration
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (true) {
        const userPrompt = await new Promise<string>((resolve) => {
            rl.question("Enter your prompt for Gemini (or type 'exit' to quit): ", resolve);
        });
        if (userPrompt.toLowerCase() === 'exit') {
            console.log("Exiting...");
            break;
        }
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: userPrompt }] }],
        config: {
            systemInstruction: {
            parts: [{ text: "Respond in a maximum of three lines." }]
            }
        }
        });

        const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    
        console.log("\n--- GEMINI RESPONSE ---");
        console.log(generatedText || "Error: No text was generated.");
        console.log("-----------------------");

    }

  // 4. Call the API

    // 5. Print the generated text
    

  } catch (error: any) {
    console.error("\nAPI Call Failed.");
    // This catches the 'NO_ADC_FOUND' or other connection errors
    console.error(error.message); 
    if (error.message.includes("default credentials")) {
        console.error("\nRemember to explicitly set your key using: export GEMINI_API_KEY=\"...\"");
    }
  }
}

runTest();
