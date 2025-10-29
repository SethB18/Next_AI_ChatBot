import React from "react";

export async function GET(request){
    return new Response(JSON.stringify({"Messsage": "Hello from NextJs"}))
}

export async function POST(request){
    const data = await request.json()
    console.log("Recieve Parameter: ", data)
    return new Response(JSON.stringify({"Messsage": "Booked"}))
}