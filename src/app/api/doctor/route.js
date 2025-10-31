let getDoctor = [
    {
        'id':1,
        'name': 'Dr.Jone',
        'specialty':'Cardiology',
        
    },
    {
        'id':2,
        'name': 'Dr.Tyson',
        'specialty':'Cardiology',
        
    },
    {
        'id':3,
        'name': 'Dr. Kim Vexler',
        'specialty':'Neurology',
        
    },
    {
        'id':4,
        'name': 'Dr. Jesse',
        'specialty':'Dermatology',
        
    },
    {
        'id':5,
        'name': 'Dr. Griek',
        'specialty':'Dermatology',
        
    }
]

export async function GET(request){
    return new Response(JSON.stringify(getDoctor), {
        headers: { 'Content-Type': 'application/json' },
    })
}