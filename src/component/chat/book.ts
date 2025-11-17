export default async function Book(patient_name:string, doctor_name:string, book_date : string){
    const url = "/api/appointment";
<<<<<<< HEAD
=======
    
>>>>>>> b4fb0982dafc20954f4d1e78f984d794be0c7960
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            patient_name: patient_name,
            doctor_name: doctor_name,
            book_date: book_date
        })
    };
    try {
        const slots = await fetch(url, config); 
        if (!slots.ok) {
            throw new Error(`HTTP error! Status: ${slots.status} - ${await slots.text()}`);
        }
        console.log("Get Booked")
        const data = await slots.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error; 
    }
}