export default function Slot() {
    const getDoctor = [
<<<<<<< HEAD
        {
            name: 'Dr.Jone',
            specialty: 'Cardiology',
            appointment: [
                "Patient 954 - Dr.Jone on 2025-11-10 10:00 AM",
                "Patient 677 - Dr.Jone on 2025-11-11 01:00 PM"
            ],
            open_slots: [
                "2025-11-14 10:00 AM",
                "2025-11-15 04:00 PM"
            ]
        },
        {
            name: 'Dr.Lee',
            specialty: 'Radiology',
            appointment: [
                "Patient 812 - Dr.Lee on 2025-11-10 10:00 AM",
                "Patient 421 - Dr.Lee on 2025-11-11 01:00 PM"
            ],
            open_slots: [
                "2025-11-14 10:00 AM",
                "2025-11-15 04:00 PM"
            ]
        },
        {
            name: 'Dr.Patel',
            specialty: 'Endocrinology',
            appointment: [
                "Patient 733 - Dr.Patel on 2025-11-11 09:30 AM",
                "Patient 244 - Dr.Patel on 2025-11-12 02:00 PM"
            ],
            open_slots: [
                "2025-11-14 01:00 PM"
            ]
        },
        {
            name: 'Dr.Tyson',
            specialty: 'Cardiology',
            appointment: [
                "Patient 954 - Dr.Tyson on 2025-11-11 09:00 AM",
                "Patient 677 - Dr.Tyson on 2025-11-12 02:00 PM"
            ],
            open_slots: [
                "2025-11-14 01:00 PM"
            ]
        },
        {
            name: 'Dr.Kim Vexler',
            specialty: 'Neurology',
            appointment: [
                "Patient 906 - Dr.Kim Vexler on 2025-11-11 10:00 AM",
                "Patient 677 - Dr.Kim Vexler on 2025-11-12 03:00 PM"
            ],
            open_slots: [
                "2025-11-14 11:00 AM",
                "2025-11-15 02:00 PM"
            ]
        },
        {
            name: 'Dr.Jesse',
            specialty: 'Dermatology',
            appointment: [
                "Patient 954 - Dr.Jesse on 2025-11-11 11:00 AM",
                "Patient 677 - Dr.Jesse on 2025-11-13 10:00 AM"
            ],
            open_slots: [
                "2025-11-14 09:00 AM",
                "2025-11-15 11:00 AM",
                "2025-11-16 04:00 PM"
            ]
        },
        {
            name: 'Dr.Griek',
            specialty: 'Dermatology',
            appointment: [
                "Patient 906 - Dr.Griek on 2025-11-11 10:00 AM"
            ],
            open_slots: [
                "2025-11-14 02:00 PM"
            ]
        },
        {
            name: 'Dr.Anya Sharma',
            specialty: 'Pediatrics',
            appointment: [
                "Patient 102 - Dr.Anya Sharma on 2025-11-12 10:00 AM",
                "Patient 305 - Dr.Anya Sharma on 2025-11-13 04:00 PM"
            ],
            open_slots: [
                "2025-11-14 03:00 PM",
                "2025-11-15 10:00 AM",
                "2025-11-16 11:00 AM"
            ]
        },
        {
            name: 'Dr.Ben Carter',
            specialty: 'Orthopedics',
            appointment: [],
            open_slots: [
                "2025-11-14 03:00 PM",
                "2025-11-15 10:00 AM"
            ]
        },

        // ----- NEW DOCTORS -----

        {
            name: 'Dr.Selena Moore',
            specialty: 'Gastroenterology',
            appointment: [
                "Patient 500 - Dr.Moore on 2025-11-13 09:00 AM"
            ],
            open_slots: [
                "2025-11-14 02:00 PM",
                "2025-11-15 11:00 AM",
                "2025-11-16 03:00 PM"
            ]
        },
        {
            name: 'Dr.Hakeem Yusuf',
            specialty: 'Urology',
            appointment: [
                "Patient 221 - Dr.Yusuf on 2025-11-12 01:00 PM"
            ],
            open_slots: [
                "2025-11-14 04:00 PM",
                "2025-11-15 09:00 AM",
                "2025-11-16 01:00 PM"
            ]
        },
        {
            name: 'Dr.Luna Park',
            specialty: 'Psychiatry',
            appointment: [
                "Patient 888 - Dr.Luna Park on 2025-11-11 11:30 AM",
                "Patient 412 - Dr.Luna Park on 2025-11-13 02:00 PM"
            ],
            open_slots: [
                "2025-11-14 10:30 AM",
                "2025-11-15 03:30 PM",
                "2025-11-16 12:00 PM"
            ]
        }
    ];
=======
    {
        'name': 'Dr. Jone',
        'specialty': 'Cardiology',
        'appointment': [
            "Patient 954 - Dr. Jone on 2025-11-10 10:00:00", // Booked Today (Past)
            "Patient 677 - Dr. Jone on 2025-11-11 13:00:00" // Booked Tomorrow
        ],
        'open_slots': [
            "2025-11-12 09:00:00",
            "2025-11-13 15:00:00",
            "2025-11-14 10:00:00",
            "2025-11-15 16:00:00"
        ]
    },
    {
        'name': 'Dr. Tyson',
        'specialty': 'Cardiology',
        'appointment': [
            "Patient 954 - Dr. Tyson on 2025-11-11 09:00:00",
            "Patient 677 - Dr. Tyson on 2025-11-12 14:00:00"
        ],
        'open_slots': [
            "2025-11-11 15:00:00",
            "2025-11-13 11:00:00",
            "2025-11-14 13:00:00"
        ]
    },
    {
        'name': 'Dr. Kim Vexler',
        'specialty': 'Neurology',
        'appointment': [
            "Patient 906 - Dr. Kim Vexler on 2025-11-11 10:00:00",
            "Patient 677 - Dr. Kim Vexler on 2025-11-12 15:00:00"
        ],
        'open_slots': [
            "2025-11-13 10:00:00",
            "2025-11-14 11:00:00",
            "2025-11-15 14:00:00"
        ]
    },
    {
        'name': 'Dr. Jesse',
        'specialty': 'Dermatology',
        'appointment': [
            "Patient 954 - Dr. Jesse on 2025-11-11 11:00:00",
            "Patient 677 - Dr. Jesse on 2025-11-13 10:00:00"
        ],
        'open_slots': [
            "2025-11-12 14:00:00",
            "2025-11-14 09:00:00",
            "2025-11-15 11:00:00",
            "2025-11-16 16:00:00"
        ]
    },
    {
        'name': 'Dr. Griek',
        'specialty': 'Dermatology',
        'appointment': [
            "Patient 906 - Dr. Griek on 2025-11-11 10:00:00"
        ],
        'open_slots': [
            "2025-11-12 10:00:00",
            "2025-11-13 09:00:00",
            "2025-11-14 14:00:00"
        ]
    },
    // --- New Sample Data ---
    {
        'name': 'Dr. Anya Sharma',
        'specialty': 'Pediatrics',
        'appointment': [
            "Patient 102 - Dr. Sharma on 2025-11-12 10:00:00",
            "Patient 305 - Dr. Sharma on 2025-11-13 16:00:00"
        ],
        'open_slots': [
            "2025-11-11 14:00:00",
            "2025-11-14 15:00:00",
            "2025-11-15 10:00:00",
            "2025-11-16 11:00:00"
        ]
    },
    {
        'name': 'Dr. Ben Carter',
        'specialty': 'Orthopedics',
        'appointment': [], 
        'open_slots': [
            "2025-11-11 09:00:00",
            "2025-11-12 11:00:00",
            "2025-11-13 13:00:00",
            "2025-11-14 15:00:00",
            "2025-11-15 10:00:00"
        ]
    }
];
>>>>>>> b4fb0982dafc20954f4d1e78f984d794be0c7960

    return getDoctor;
}
