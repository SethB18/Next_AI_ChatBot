import React from "react";
import { NextResponse } from "next/server";
const getDoctor = [
    {
      'name': 'Dr.Jone',
      'specialty':'Cardiology',
      'appointment' : [
        "Patient 954 - Dr.Jone on 2025-10-30 11:00:00",
        "Patient 906 - Dr.Jone on 2025-10-31 17:00:00",
        "Patient 916 - Dr.Jone on 2025-10-31 07:00:00",
        "Patient 677 - Dr.Jone on 2025-11-01 10:00:00",
        "Patient 607 - Dr.Jone on 2025-11-01 07:00:00"
      ]
    },
]

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