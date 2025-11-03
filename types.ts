
export interface Staff {
  id: number;
  name: string;
  title: string;
  avatarUrl: string;
  services: number[];
}

export interface Service {
  id: number;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface TimeSlot {
    start: Date;
    end: Date;
}

export interface Booking {
  staff: Staff;
  service: Service;
  time: Date;
  customerName: string;
  customerEmail: string;
}
