import Link from "next/link";

const CONTACT_EMAIL = "hello@meetly.app";

export function HelpPageContent() {
  return (
    <>
      <p>
        Meetly helps solo hosts share a booking link, set availability, and accept meetings without
        back-and-forth email. This guide covers the host dashboard, guest booking flow, and common
        setup questions.
      </p>

      <section>
        <h2>Getting started</h2>
        <ol>
          <li>Create your account with email, Google, or Microsoft.</li>
          <li>Set your weekly availability under Availability.</li>
          <li>Create at least one event type with a duration and booking rules.</li>
          <li>Copy your booking link from the dashboard or Event Types page and share it.</li>
        </ol>
        <p>
          New accounts include a default 30-minute event type and weekday hours so you can share a
          link right away.
        </p>
      </section>

      <section>
        <h2>Share your booking link</h2>
        <p>
          Each event type has its own URL: <strong>/book/your-username/event-slug</strong>. Use{" "}
          <strong>Copy booking link</strong> on the dashboard or open Event Types to copy a specific
          link.
        </p>
        <p>
          Share the link in email signatures, social bios, or your website. Guests do not need a
          Meetly account to book.
        </p>
      </section>

      <section>
        <h2>Event types</h2>
        <p>Event types define what guests can book. For each one you can set:</p>
        <ul>
          <li>Title and URL slug</li>
          <li>Duration, location, and description</li>
          <li>Buffer time before and after meetings</li>
          <li>Minimum notice and how far ahead guests can book</li>
        </ul>
        <p>
          Inactive event types stay in your dashboard but are hidden from your public booking page.
        </p>
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          Weekly hours control which days and times appear on your booking page. Turn days off or set
          custom start and end times for each day you are open.
        </p>
        <p>
          Use <strong>Date-specific hours</strong> to block a day off or override your usual schedule
          for a single date — useful for vacations or special hours.
        </p>
      </section>

      <section>
        <h2>Google Calendar sync</h2>
        <p>
          Google Calendar connection is optional. Connect it in Settings when you want Meetly to:
        </p>
        <ul>
          <li>Block times when you are already busy</li>
          <li>Create Google Calendar events when guests book</li>
          <li>Remove calendar events when bookings are cancelled</li>
        </ul>
        <p>
          Signing in with Google is separate from connecting Calendar. You can use email or Microsoft
          login and still connect Google Calendar later.
        </p>
      </section>

      <section>
        <h2>Bookings and calendar</h2>
        <ul>
          <li>
            <strong>Bookings</strong> lists upcoming and past meetings. You can cancel upcoming
            bookings and share a guest cancel link.
          </li>
          <li>
            <strong>Calendar</strong> shows Meetly bookings alongside Google Calendar events when
            connected.
          </li>
          <li>
            Guests can reschedule or cancel from the links in their confirmation email or on the
            confirmation screen after booking.
          </li>
        </ul>
      </section>

      <section>
        <h2>Contacts</h2>
        <p>
          Guests who book through your links are added to Contacts automatically. You can also add
          people manually, keep private notes, search and sort your list, and export a CSV.
        </p>
      </section>

      <section>
        <h2>Email notifications</h2>
        <p>In Settings, choose which emails Meetly sends:</p>
        <ul>
          <li>A new-booking alert to you when someone books</li>
          <li>A confirmation email to the guest with meeting details</li>
          <li>Reminder emails to you and guests before upcoming meetings</li>
        </ul>
        <p>Email delivery requires Meetly&apos;s email service to be configured for your deployment.</p>
      </section>

      <section>
        <h2>Install on your phone</h2>
        <p>
          Meetly works as a progressive web app. On Android or desktop Chrome, tap{" "}
          <strong>Install app</strong> when prompted. On iPhone, open Meetly in Safari, tap Share, then{" "}
          <strong>Add to Home Screen</strong>.
        </p>
      </section>

      <section>
        <h2>Still need help?</h2>
        <p>
          Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. For account or billing
          questions, include the email address you use to sign in.
        </p>
        <p>
          See also our <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>
      </section>
    </>
  );
}
