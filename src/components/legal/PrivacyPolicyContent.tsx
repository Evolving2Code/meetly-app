import Link from "next/link";

const CONTACT_EMAIL = "hello@meetly.app";

export function PrivacyPolicyContent() {
  return (
    <>
      <p>
        This Privacy Policy explains how Meetly (&quot;Meetly,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) collects, uses, and shares information when you use our scheduling platform
        at meetly.app and related services (the &quot;Service&quot;).
      </p>
      <p>
        Meetly helps solo hosts share booking links so guests can schedule meetings. Because hosts
        and guests interact with the Service in different ways, your relationship to Meetly may
        differ depending on whether you create an account or book time as a guest.
      </p>

      <section>
        <h2>1. Who we are</h2>
        <p>
          Meetly operates the Service. For privacy questions or requests, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>

        <h3>Host account information</h3>
        <p>If you sign up as a host, we collect:</p>
        <ul>
          <li>Email address and password (if you use email sign-up)</li>
          <li>Name and profile image (from your account or OAuth provider)</li>
          <li>Username, timezone, availability, and event-type settings</li>
          <li>Booking records for meetings scheduled through your links</li>
        </ul>

        <h3>Guest booking information</h3>
        <p>If you book a meeting through a host&apos;s link without creating an account, we collect:</p>
        <ul>
          <li>Your name and email address</li>
          <li>Optional notes you choose to provide</li>
          <li>Selected meeting time, timezone, and related booking details</li>
        </ul>

        <h3>Google Calendar integration (hosts only)</h3>
        <p>
          If a host connects Google Calendar in Settings, we store OAuth access and refresh tokens
          and use them to read busy times, create calendar events, and delete events when bookings
          are cancelled. We do not access calendar data unless a host explicitly connects this
          integration.
        </p>

        <h3>Technical and usage information</h3>
        <p>We automatically collect limited technical data needed to operate the Service, such as:</p>
        <ul>
          <li>Session cookies and authentication tokens (via Supabase Auth)</li>
          <li>Short-lived OAuth state cookies when connecting Google Calendar</li>
          <li>Server and application logs (for example, request metadata and error diagnostics)</li>
        </ul>
        <p>
          We do not use advertising or analytics cookies at this time. If that changes, we will
          update this policy.
        </p>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide, maintain, and improve the Service</li>
          <li>Create and manage host accounts and booking pages</li>
          <li>Process guest bookings and show available time slots</li>
          <li>Sync meetings with Google Calendar when a host has connected it</li>
          <li>Send service-related communications (such as booking confirmations)</li>
          <li>Protect the Service against abuse, fraud, and security incidents</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2>4. Hosts and guests: who controls your data</h2>
        <p>
          <strong>Hosts</strong> who use Meetly to offer booking links generally decide what
          information to collect from guests (name, email, and optional notes) and how to use that
          information for their own scheduling purposes. In that relationship, the host is typically
          the data controller for guest booking information, and Meetly acts as a service provider
          processing that information on the host&apos;s behalf.
        </p>
        <p>
          <strong>Guests</strong> should contact the host directly for questions about how that host
          uses booking information. You may also contact Meetly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will help route or respond
          to requests where appropriate.
        </p>
        <p>
          For host account data and data Meetly collects to operate the platform, Meetly is the
          data controller.
        </p>
      </section>

      <section>
        <h2>5. How we share information</h2>
        <p>We share information only as needed to provide the Service:</p>
        <ul>
          <li>
            <strong>With hosts:</strong> when you book as a guest, your name, email, notes, and
            booking details are shared with the host you are scheduling with.
          </li>
          <li>
            <strong>With service providers:</strong> we use trusted vendors to host and operate
            Meetly, including:
            <ul>
              <li>Supabase (database and authentication)</li>
              <li>Vercel (application hosting)</li>
              <li>Google (OAuth login and optional Calendar API access)</li>
              <li>Microsoft (optional OAuth login via Azure)</li>
            </ul>
          </li>
          <li>
            <strong>For legal and safety reasons:</strong> if required by law, to protect rights and
            safety, or to enforce our <Link href="/terms">Terms of Service</Link>.
          </li>
          <li>
            <strong>Business transfers:</strong> in connection with a merger, acquisition, or sale
            of assets, subject to this policy.
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>6. Data retention</h2>
        <p>
          We retain information for as long as needed to provide the Service and for legitimate
          business purposes, including resolving disputes and meeting legal obligations.
        </p>
        <ul>
          <li>Host account data is kept while your account is active.</li>
          <li>Booking records are kept to support scheduling history and host dashboards.</li>
          <li>
            Google Calendar tokens are kept until a host disconnects Calendar or deletes their
            account.
          </li>
          <li>
            When you delete your host account, associated profile, availability, event types, and
            stored integration tokens are removed in line with our data deletion processes.
          </li>
        </ul>
        <p>
          To request deletion of your data, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          We use administrative, technical, and organizational measures designed to protect personal
          information, including encrypted connections (HTTPS), access controls, and database
          security policies. No method of transmission or storage is completely secure, and we
          cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>8. Your privacy rights</h2>
        <p>Depending on where you live, you may have rights to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Delete your information, subject to legal exceptions</li>
          <li>Object to or restrict certain processing</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Request a portable copy of your information</li>
          <li>Lodge a complaint with your local data protection authority</li>
        </ul>
        <p>
          To exercise these rights, contact{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may need to verify your
          identity before fulfilling a request.
        </p>
        <p>
          If you are a guest, we may direct certain requests to the relevant host when they control
          the underlying booking data.
        </p>
      </section>

      <section>
        <h2>9. International data transfers</h2>
        <p>
          Meetly may process and store information in the United States and other countries where we
          or our service providers operate. If you access the Service from outside the United
          States, your information may be transferred to jurisdictions that may have different data
          protection laws than your home country.
        </p>
      </section>

      <section>
        <h2>10. Cookies</h2>
        <p>Meetly uses cookies and similar technologies for essential purposes only:</p>
        <ul>
          <li>
            <strong>Authentication cookies:</strong> to keep hosts signed in and maintain secure
            sessions.
          </li>
          <li>
            <strong>OAuth state cookies:</strong> short-lived cookies used during Google Calendar
            connection to prevent unauthorized requests.
          </li>
        </ul>
        <p>
          You can control cookies through your browser settings. Disabling essential cookies may
          prevent parts of the Service from working.
        </p>
      </section>

      <section>
        <h2>11. Children&apos;s privacy</h2>
        <p>
          The Service is not directed to children under 13 (or the minimum age required in your
          jurisdiction), and we do not knowingly collect personal information from children. If you
          believe a child has provided us personal information, contact us and we will take
          appropriate steps to delete it.
        </p>
      </section>

      <section>
        <h2>12. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the updated version on
          this page and revise the &quot;Last updated&quot; date. Material changes may also be
          communicated through the Service or by email where appropriate.
        </p>
      </section>

      <section>
        <h2>13. Contact us</h2>
        <p>
          Questions about this Privacy Policy or our data practices? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </>
  );
}
