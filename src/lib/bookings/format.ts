type GuestBookingRow = {
  id: string;
  start_time: string;
  end_time: string;
  cancel_token: string;
  guest_name: string;
  guest_email: string;
  guest_notes: string | null;
  timezone: string;
  status: string;
  event_types?: unknown;
};

export function formatGuestBookingResponse(booking: GuestBookingRow) {
  return {
    id: booking.id,
    startTime: booking.start_time,
    endTime: booking.end_time,
    cancelToken: booking.cancel_token,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    guestNotes: booking.guest_notes,
    timezone: booking.timezone,
    status: booking.status,
    eventType: booking.event_types ?? null,
  };
}
