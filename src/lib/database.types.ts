/**
 * Types for the booking schema in supabase/schema.sql.
 * Keep in sync when the SQL changes.
 */

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "expired";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type SeatType = "regular" | "premium" | "recliner";
export type DiscountType = "percent" | "flat";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Movie = {
  id: string;
  slug: string;
  title: string;
  synopsis: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  genres: string[];
  language: string;
  certificate: string;
  duration_minutes: number;
  rating: number | null;
  release_date: string | null;
  is_active: boolean;
  created_at: string;
};

export type Theatre = {
  id: string;
  name: string;
  city: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
};

export type Screen = {
  id: string;
  theatre_id: string;
  name: string;
  screen_type: string;
  created_at: string;
};

export type Seat = {
  id: string;
  screen_id: string;
  row_label: string;
  seat_number: number;
  seat_type: SeatType;
  price_multiplier: number;
  is_active: boolean;
};

export type Show = {
  id: string;
  movie_id: string;
  screen_id: string;
  starts_at: string;
  base_price: number;
  language: string;
  format: string;
  is_active: boolean;
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_amount: number;
  max_discount: number | null;
  valid_from: string;
  valid_to: string | null;
  usage_limit: number | null;
  times_used: number;
  is_active: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  booking_code: string;
  user_id: string;
  show_id: string;
  coupon_id: string | null;
  status: BookingStatus;
  subtotal_amount: number;
  discount_amount: number;
  convenience_fee: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type BookingSeat = {
  id: string;
  booking_id: string;
  show_id: string;
  seat_id: string;
  price: number;
  is_active: boolean;
  created_at: string;
};

export type Payment = {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  transaction_ref: string;
  is_simulated: boolean;
  created_at: string;
};

export type ShowSeat = {
  seat_id: string;
  row_label: string;
  seat_number: number;
  seat_type: SeatType;
  price: number;
  is_booked: boolean;
};

type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile>;
      movies: TableDef<Movie>;
      theatres: TableDef<Theatre>;
      screens: TableDef<Screen>;
      seats: TableDef<Seat>;
      shows: TableDef<Show>;
      coupons: TableDef<Coupon>;
      bookings: TableDef<Booking>;
      booking_seats: TableDef<BookingSeat>;
      payments: TableDef<Payment>;
    };
    Views: { [_ in never]: never };
    Functions: {
      get_show_seats: {
        Args: { p_show_id: string };
        Returns: ShowSeat[];
      };
      create_booking: {
        Args: { p_show_id: string; p_seat_ids: string[]; p_coupon_code?: string | null };
        Returns: string;
      };
      pay_booking: {
        Args: { p_booking_id: string; p_method: string; p_succeed?: boolean };
        Returns: PaymentStatus;
      };
      cancel_booking: {
        Args: { p_booking_id: string };
        Returns: void;
      };
    };
    Enums: {
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      seat_type: SeatType;
      discount_type: DiscountType;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
