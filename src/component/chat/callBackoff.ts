const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
const MODEL_NAME = 'gemini-2.5-flash';

const callApiWithBackoff = async (payload: any, maxRetries = 5): Promise<any> => {
    let delay = 1000;
    // NOTE: Using MODEL_NAME constant from outside the function
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Retry on rate limit (429) or server errors (5xx)
            if (response.status === 429 || response.status >= 500) { 
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                    continue;
                }
            }
            
            if (!response.ok) {
                const errorBody = await response.text();
                // Throwing the error with status and body is crucial for debugging
                throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
            }

            return await response.json();
            
        } catch (error) {
            if (i === maxRetries - 1) throw error; // Re-throw on final failure
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
};

export default callApiWithBackoff
