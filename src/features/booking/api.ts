import { supabase } from "@/lib/supabase";
import type {
  Booking,
  BookingStatus,
  Coupon,
  Movie,
  PaymentStatus,
  SeatType,
  ShowSeat,
} from "@/lib/database.types";

export interface TheatreSummary {
  id: string;
  name: string;
  city: string;
  address: string | null;
}

export interface ShowWithVenue {
  id: string;
  starts_at: string;
  base_price: number;
  format: string;
  language: string;
  screens: {
    id: string;
    name: string;
    screen_type: string;
    theatres: TheatreSummary;
  };
}

export interface ShowDetail extends ShowWithVenue {
  movies: Pick<Movie, "id" | "slug" | "title" | "duration_minutes" | "certificate" | "poster_url">;
}

export interface BookingDetail extends Booking {
  shows: ShowDetail;
  booking_seats: {
    id: string;
    price: number;
    is_active: boolean;
    seats: { row_label: string; seat_number: number; seat_type: SeatType };
  }[];
  payments: {
    id: string;
    amount: number;
    method: string;
    status: PaymentStatus;
    transaction_ref: string;
    created_at: string;
  }[];
}

const SHOW_WITH_VENUE = `
  id, starts_at, base_price, format, language,
  screens!inner ( id, name, screen_type, theatres!inner ( id, name, city, address ) )
`;

const SHOW_DETAIL = `
  ${SHOW_WITH_VENUE},
  movies!inner ( id, slug, title, duration_minutes, certificate, poster_url )
`;

const unwrap = <T>({ data, error }: { data: T | null; error: { message: string } | null }): T => {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("No data returned");
  return data;
};

export const listMovies = async (): Promise<Movie[]> =>
  unwrap(
    await supabase
      .from("movies")
      .select("*")
      .eq("is_active", true)
      .order("release_date", { ascending: false }),
  );

export const getMovieBySlug = async (slug: string): Promise<Movie> =>
  unwrap(await supabase.from("movies").select("*").eq("slug", slug).single());

export const listShowsForMovie = async (movieId: string): Promise<ShowWithVenue[]> =>
  unwrap(
    await supabase
      .from("shows")
      .select(SHOW_WITH_VENUE)
      .eq("movie_id", movieId)
      .eq("is_active", true)
      .gt("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .returns<ShowWithVenue[]>(),
  );

export const getShow = async (showId: string): Promise<ShowDetail> =>
  unwrap(await supabase.from("shows").select(SHOW_DETAIL).eq("id", showId).single<ShowDetail>());

export const getShowSeats = async (showId: string): Promise<ShowSeat[]> =>
  unwrap(await supabase.rpc("get_show_seats", { p_show_id: showId }));

export const listCoupons = async (): Promise<Coupon[]> =>
  unwrap(await supabase.from("coupons").select("*").order("min_amount", { ascending: true }));

export const createBooking = async (input: {
  showId: string;
  seatIds: string[];
  couponCode?: string | null;
}): Promise<string> =>
  unwrap(
    await supabase.rpc("create_booking", {
      p_show_id: input.showId,
      p_seat_ids: input.seatIds,
      p_coupon_code: input.couponCode ?? null,
    }),
  );

export const payBooking = async (input: {
  bookingId: string;
  method: string;
  succeed: boolean;
}): Promise<PaymentStatus> =>
  unwrap(
    await supabase.rpc("pay_booking", {
      p_booking_id: input.bookingId,
      p_method: input.method,
      p_succeed: input.succeed,
    }),
  );

export const cancelBooking = async (bookingId: string): Promise<void> => {
  const { error } = await supabase.rpc("cancel_booking", { p_booking_id: bookingId });
  if (error) throw new Error(error.message);
};

const BOOKING_DETAIL = `
  *,
  shows!inner ( ${SHOW_DETAIL} ),
  booking_seats ( id, price, is_active, seats!inner ( row_label, seat_number, seat_type ) ),
  payments ( id, amount, method, status, transaction_ref, created_at )
`;

export const getBooking = async (bookingId: string): Promise<BookingDetail> =>
  unwrap(
    await supabase
      .from("bookings")
      .select(BOOKING_DETAIL)
      .eq("id", bookingId)
      .single<BookingDetail>(),
  );

export const listMyBookings = async (): Promise<BookingDetail[]> =>
  unwrap(
    await supabase
      .from("bookings")
      .select(BOOKING_DETAIL)
      .order("created_at", { ascending: false })
      .returns<BookingDetail[]>(),
  );

export const bookingKeys = {
  movies: ["movies"] as const,
  movie: (slug: string) => ["movie", slug] as const,
  shows: (movieId: string) => ["shows", movieId] as const,
  show: (showId: string) => ["show", showId] as const,
  seats: (showId: string) => ["show-seats", showId] as const,
  coupons: ["coupons"] as const,
  booking: (bookingId: string) => ["booking", bookingId] as const,
  myBookings: ["my-bookings"] as const,
};

export const bookingStatusTone = (
  status: BookingStatus,
): "brand" | "muted" | "warning" | "destructive" => {
  switch (status) {
    case "confirmed":
      return "brand";
    case "pending":
      return "warning";
    case "cancelled":
    case "expired":
      return "destructive";
    default:
      return "muted";
  }
};
