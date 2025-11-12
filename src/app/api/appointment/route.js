import React from "react";
import { NextResponse } from "next/server";
import Slot from "@/fetch_data/fetch_slot";
const getDoctor = Slot();

export async function GET(request){
    return new Response(JSON.stringify({"Messsage" : "Hello from NextJs"}))
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { patient_name, doctor_name, book_date } = data

    const doctor = getDoctor.find(d => d.name === doctor_name.trim());

    let trim_dr = doctor_name.trim()

    console.log("Doctor_name :",doctor_name,"----After trim", trim_dr)


    if (!doctor) {
        console.log(`❌ Doctor ${doctor_name} not found`);
    } else {
    const isBusy = doctor.appointment.some(a => a.includes(book_date));

    if (isBusy) {
        console.log(`🚫 ${doctor_name} is busy on ${book_date}`);
    } else {
        console.log(`✅ ${doctor_name} is available on ${book_date}`);
    }
    }
    if (!patient_name || !doctor_name || !book_date ) {
      return NextResponse.json(
        {
          error: "Missing required parameters.",
          required: ["patient_name", "doctor_name", "book_date"],
          received: data,
        },
        { status: 400 }
      )
    }
    
    console.log("✅ Received:", { patient_name, doctor_name, book_date })
    return NextResponse.json({ message: "Booked successfully!" })
  } catch (error) {
    console.error("❌ Error:", error)
    return NextResponse.json(
      { error: "Invalid request or JSON format." },
      { status: 500 }
    )
  }
}