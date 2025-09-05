// src/data/eventsData.ts
export interface Reviews {
  user: string;
  comment: string;
  rating?: number;
}

export interface Event {
  id: number;
  image: string;
  title: string;
  desc: string;
  category: string;
  location: string;
  date: string;
  time: string;
  ticket_price: number;
  reviews?: Reviews[];
}

const events: Event[] = [
  {
    id: 1,
    image: "/src/assets/images/ED.png",
    title: "React & Next.js Conference 2024",
    desc: "Join us for the biggest React Conference of the year...",
    category: "Tech",
    location: "Silicon Valley Tech Hub, Douala, Cameroon",
    date: "March 15, 2024",
    time: "10:00 AM - 5:00 PM",
    ticket_price: 299,
    reviews: [
      { user: "Alice", comment: "Amazing event!" },
      { user: "Bob", comment: "Learned a lot!" },
    ],
  },
  // add more events...
];

export default events;
