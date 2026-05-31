import { Event } from "./types";

export const INITIAL_EVENTS: Event[] = [
  {
    id: "evt-cse-01",
    name: "InnovaTech Multi-Track Hackathon 2026",
    department: "Computer Science & Engineering",
    dateTime: "October 15, 2026, 09:00 AM - 05:00 PM",
    venue: "Main Seminar Hall & Advanced AI Lab",
    price: 15,
    totalTickets: 120,
    availableTickets: 84,
    description: "Unleash your creativity at our annual multi-track hackathon. Collaborate in teams, solve real-world problems in HealthTech, EdTech, and Sustainability, and win exciting cash prizes or incubation tracks, judged by tech experts from Google and top accelerators.",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    tags: ["Coding", "Hackathon", "Prizes"]
  },
  {
    id: "evt-it-02",
    name: "National Seminar on Quantum AI & Neural Networks",
    department: "Information Technology",
    dateTime: "November 02, 2026, 10:30 AM - 01:30 PM",
    venue: "Sir CV Raman Auditorium, Block 3",
    price: 25,
    totalTickets: 60,
    availableTickets: 15,
    description: "Dive into the exciting convergence of Quantum Computing and Artificial Intelligence. This seminar features guest lectures from senior quantum researchers, exploring physical qubit layouts, variational algorithms, and the future of machine learning speedups.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    tags: ["AI", "Quantum", "Research"]
  },
  {
    id: "evt-ece-03",
    name: "RoboClash: Autonomous Drone & Arena Battles",
    department: "Electronics & Communication Engineering",
    dateTime: "October 28, 2026, 02:00 PM - 06:00 PM",
    venue: "Main Campus Arena & Open Air Theatre (OAT)",
    price: 10,
    totalTickets: 150,
    availableTickets: 112,
    description: "Witness robots and drones battle in a custom obstacle course and combat arena! Students from across various colleges compete with their self-designed, autonomous, and radio-controlled bots. Register early for physical ringside seats.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    tags: ["Robotics", "Drones", "Action"]
  },
  {
    id: "evt-bt-04",
    name: "BioSpark Symposium: Genomics & Bioinformatics",
    department: "Biotechnology & Bio-Sciences",
    dateTime: "December 10, 2026, 11:00 AM - 04:00 PM",
    venue: "Biotechnology Department Seminar Hall",
    price: 20,
    totalTickets: 45,
    availableTickets: 42,
    description: "A prestigious assembly of researchers discussing gene therapies, personalized diagnostics, and high-performance pipeline architectures for sequencing. Ideal for students pursuing research in biomedical engineering and clinical genetics.",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=800&q=80",
    tags: ["Genetics", "BioTech", "Symposium"]
  }
];
