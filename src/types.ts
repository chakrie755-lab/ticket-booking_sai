export interface Event {
  id: string;
  name: string;
  department: string;
  dateTime: string;
  venue: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  userName: string;
  userEmail: string;
  userDepartment: string;
  ticketsBooked: number;
  totalAmount: number;
  bookingDate: string;
  ticketCode: string;
}
