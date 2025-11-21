// mockData.js
// Comprehensive mock data with 10 hospitals, multiple doctors, and slot generation.
// Exports:
//  - hospitals: array of hospital objects (each has doctors array)
//  - generateSlotsForDoctor(doctorId, days): returns slots for given doctor for the next `days` days (default 7)

const crypto = require('crypto');

function uid(prefix = '') {
  return prefix + crypto.randomBytes(4).toString('hex');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Dental',
  'ENT',
  'Neurology',
  'Gynecology',
  'Emergency',
  'Psychiatry',
  'Ophthalmology',
];

function sample(arr, n) {
  const out = [];
  const copy = [...arr];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// Helper: generate next N dates (YYYY-MM-DD)
function nextNDates(n) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

// Generate time slots for one date (example: 09:00..17:00 every 30 min)
function timeSlotsForDate(date, startHour = 9, endHour = 17, intervalMin = 30) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMin) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${date}T${hh}:${mm}:00`);
    }
  }
  return slots;
}

// Public helper: generate slots for a doctor for next `days` days.
// Returns array of slot objects: { slotId, doctorId, date (YYYY-MM-DD), time (HH:MM), datetime, available }
function generateSlotsForDoctor(doctorId, days = 7) {
  const dates = nextNDates(days);
  const allSlots = [];
  dates.forEach((date) => {
    const isoSlots = timeSlotsForDate(date); // default 9-17 every 30
    isoSlots.forEach((dt) => {
      const time = dt.slice(11, 16);
      allSlots.push({
        slotId: uid('slot_'),
        doctorId,
        date,
        time,
        datetime: dt,
        // Random availability: ~80% available
        available: Math.random() > 0.2,
      });
    });
  });
  return allSlots;
}

// Create doctor object factory
function createDoctor(name, specialty, fee = 500) {
  return {
    id: uid('doc_'),
    name,
    specialty,
    department: specialty, // keep department same as specialty for clarity
    fee,
    experienceYears: randomInt(3, 25),
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
    about: `${name} is an experienced ${specialty} with ${randomInt(3, 25)} years of practice.`,
    // slots can be generated on demand via generateSlotsForDoctor(doctor.id)
  };
}

// 10 Hospitals each with 4-5 doctors
const hospitals = [
  {
    id: uid('hosp_'),
    name: 'City Health Center',
    city: 'Mumbai',
    address: '12 MG Road, Mumbai',
    phone: '+91-22-4000-1000',
    specialties: ['General Medicine', 'Pediatrics', 'Dental', 'Orthopedics'],
    emergency: true,
    departments: ['Emergency', 'Dental', 'Cardiology', 'Orthopedics', 'Pediatrics'],
    doctors: [
      createDoctor('Dr. Asha Kumar', 'General Medicine', 400),
      createDoctor('Dr. Rajesh Verma', 'Orthopedics', 700),
      createDoctor('Dr. Neha Sharma', 'Dental', 350),
      createDoctor('Dr. Sneha Patel', 'Pediatrics', 400),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Green Valley Hospital',
    city: 'Bengaluru',
    address: '45 Green Ave, Bengaluru',
    phone: '+91-80-3000-2000',
    specialties: ['Cardiology', 'Neurology', 'ENT'],
    emergency: true,
    departments: ['Emergency', 'Cardiology', 'Neurology', 'ENT'],
    doctors: [
      createDoctor('Dr. Meera Singh', 'Cardiology', 1200),
      createDoctor('Dr. Vikram Joshi', 'Neurology', 1100),
      createDoctor('Dr. Shalini Rao', 'ENT', 600),
      createDoctor('Dr. Amit Malhotra', 'General Medicine', 450),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Riverfront Medical',
    city: 'Kolkata',
    address: '3 River Road, Kolkata',
    phone: '+91-33-5000-3000',
    specialties: ['Dermatology', 'Orthopedics', 'Gynecology'],
    emergency: false,
    departments: ['Dermatology', 'Orthopedics', 'Gynecology', 'Emergency'],
    doctors: [
      createDoctor('Dr. Priya Banerjee', 'Dermatology', 600),
      createDoctor('Dr. Suresh Nair', 'Orthopedics', 800),
      createDoctor('Dr. Rina Das', 'Gynecology', 700),
      createDoctor('Dr. Karan Mehta', 'Dental', 400),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Sunrise Multispeciality',
    city: 'Delhi',
    address: '101 Sunrise Plaza, Delhi',
    phone: '+91-11-2200-1100',
    specialties: ['Ophthalmology', 'ENT', 'Cardiology'],
    emergency: true,
    departments: ['Ophthalmology', 'ENT', 'Cardiology', 'Emergency'],
    doctors: [
      createDoctor('Dr. Leena Gupta', 'Ophthalmology', 650),
      createDoctor('Dr. Rohit Kapoor', 'ENT', 550),
      createDoctor('Dr. Anita Sethi', 'Cardiology', 1300),
      createDoctor('Dr. Manoj Rao', 'General Medicine', 450),
      createDoctor('Dr. Tara Iyer', 'Psychiatry', 500),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Lotus Health Institute',
    city: 'Pune',
    address: '7 Lotus Lane, Pune',
    phone: '+91-20-3300-2200',
    specialties: ['Orthopedics', 'Sports Medicine', 'Dental'],
    emergency: false,
    departments: ['Orthopedics', 'Sports Medicine', 'Dental'],
    doctors: [
      createDoctor('Dr. Anil Kulkarni', 'Orthopedics', 900),
      createDoctor('Dr. Maya Iyer', 'Sports Medicine', 800),
      createDoctor('Dr. Sagar Patil', 'Dental', 400),
      createDoctor('Dr. Ritu Desai', 'Dermatology', 550),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Horizon Care Center',
    city: 'Chennai',
    address: '55 Horizon Blvd, Chennai',
    phone: '+91-44-4400-3300',
    specialties: ['Neurology', 'Pediatrics', 'Cardiology'],
    emergency: true,
    departments: ['Neurology', 'Pediatrics', 'Cardiology', 'Emergency'],
    doctors: [
      createDoctor('Dr. Priyank Saxena', 'Neurology', 1150),
      createDoctor('Dr. Kavya R', 'Pediatrics', 450),
      createDoctor('Dr. Nirmal S', 'Cardiology', 1250),
      createDoctor('Dr. Jaya Krishnan', 'ENT', 600),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Metro Clinic & Hospital',
    city: 'Ahmedabad',
    address: '22 Metro Road, Ahmedabad',
    phone: '+91-79-5500-4400',
    specialties: ['General Medicine', 'Dental', 'ENT'],
    emergency: false,
    departments: ['General Medicine', 'Dental', 'ENT'],
    doctors: [
      createDoctor('Dr. Bhavesh Shah', 'General Medicine', 450),
      createDoctor('Dr. Richa Shah', 'Dental', 380),
      createDoctor('Dr. Hiten Patel', 'ENT', 520),
      createDoctor('Dr. Mona Desai', 'Ophthalmology', 600),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Crestview Hospital',
    city: 'Lucknow',
    address: '9 Crestview St, Lucknow',
    phone: '+91-522-6600-5500',
    specialties: ['Gynecology', 'Dermatology', 'Psychiatry'],
    emergency: true,
    departments: ['Gynecology', 'Dermatology', 'Psychiatry', 'Emergency'],
    doctors: [
      createDoctor('Dr. Alka Verma', 'Gynecology', 700),
      createDoctor('Dr. Sandeep Singh', 'Dermatology', 600),
      createDoctor('Dr. Reena Tiwari', 'Psychiatry', 650),
      createDoctor('Dr. Pawan Kumar', 'General Medicine', 420),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Harbor Medical Center',
    city: 'Visakhapatnam',
    address: '88 Harbor Line, Vizag',
    phone: '+91-891-7700-6600',
    specialties: ['Cardiology', 'Orthopedics', 'ENT'],
    emergency: false,
    departments: ['Cardiology', 'Orthopedics', 'ENT'],
    doctors: [
      createDoctor('Dr. Thomas George', 'Cardiology', 1100),
      createDoctor('Dr. Sree Lekha', 'Orthopedics', 800),
      createDoctor('Dr. Sana Beg', 'ENT', 540),
      createDoctor('Dr. Vikram B', 'Dental', 390),
    ],
  },
  {
    id: uid('hosp_'),
    name: 'Alpine Healthcare',
    city: 'Dehradun',
    address: '2 Alpine Heights, Dehradun',
    phone: '+91-135-8800-7700',
    specialties: ['General Medicine', 'Ophthalmology', 'Dental'],
    emergency: true,
    departments: ['General Medicine', 'Ophthalmology', 'Dental', 'Emergency'],
    doctors: [
      createDoctor('Dr. Pooja Sharma', 'General Medicine', 420),
      createDoctor('Dr. Ramesh Chand', 'Ophthalmology', 620),
      createDoctor('Dr. Geeta Joshi', 'Dental', 400),
      createDoctor('Dr. Nilesh Rana', 'Pediatrics', 430),
    ],
  },
];

// Export hospitals and helper
module.exports = {
  hospitals,
  generateSlotsForDoctor,
};
