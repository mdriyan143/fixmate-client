export type Role = "customer" | "technician" | "admin";
export type Category =
  | "Smartphone" | "Laptop & PC" | "AC" | "Refrigerator" | "TV" | "Washing Machine" | "Electrical";
export type ServiceMode = "Home Visit" | "Shop Drop-off";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";


// the paged answer of GET /api/services?page=1
export interface ServicePage {
  items: Service[];
  total: number;
  pages: number;
}


// the small technician summary the details route adds to a service
export interface TechnicianInfo {
  name: string;
  image?: string | null;
  area?: string | null;
  bio?: string | null;
}

export interface Service {
  _id: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail?: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string;
  technician?: TechnicianInfo | null; // only on GET /api/services/:id
  avgRating?: number;
  reviewCount?: number;
}


export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: Category;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  statusHistory?: { status: string; changedAt: string }[];
  rating?: number;
  review?: string;
}

export interface Payment {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

// a row of the users collection, as the admin API returns it
export interface AppUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: Role;
  createdAt: string;
}

// values of the add / edit service form
export interface ServiceFormValues {
  title: string;
  category: Category;
  description: string;
  basePrice: string | number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  image: string;
}

// ?search=&category=&mode=&sort= on /services
export type ServiceFilters = Record<string, string>;

// one bar of a chart
export interface ChartPoint {
  name: string;
  value: number;
}
