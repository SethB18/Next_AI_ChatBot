// Example assuming this is the function that calls the Django backend
// (If you are using the proxy solution, the headers should go here OR in the proxy route)

// import { console } from "inspector";
import { json } from "stream/consumers";

export default async function Book(patient_name:string, doctor_name:string, book_date : string){
    const url = "/api/appointment";
    
    // Define the configuration object, including the method and headers
    const config = {
        method: 'POST', // Or 'POST', 'PUT', etc.
        headers: {
            // Tells the server the client will accept JSON data in the response
            'Accept': 'application/json',
            
            // Tells the server what type of data is being sent in the request body
            // (Often necessary even for GET, depending on server configuration)
            'Content-Type': 'application/json', 
            
            // If your Django API uses tokens, add the Authorization header here
            // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
        },
        body: JSON.stringify({
            patient_name: patient_name,
            doctor_name: doctor_name,
            book_date: book_date
        })
    };

    try {
        // Pass the config object as the second argument to fetch
        const slots = await fetch(url, config); 
        
        // Always check the response status!
        if (!slots.ok) {
            // Throw an error if the status is 4xx or 5xx
            throw new Error(`HTTP error! Status: ${slots.status} - ${await slots.text()}`);
        }
        console.log("Get Booked")
        
        const data = await slots.json();
        return data;
        
    } catch (error) {
        console.error("Fetch failed:", error);
        // Re-throw the error or return a default value
        throw error; 
    }
}