import Link from "next/link";

const CONTACT_EMAIL = "hello@meetly.app";

export function TermsOfServiceContent() {
  return (
    <>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Meetly&apos;s
        scheduling platform at meetly.app and related services (the &quot;Service&quot;). By
        creating an account, using the Service, or booking a meeting through a Meetly link, you
        agree to these Terms.
      </p>
      <p>
        If you do not agree, do not use the Service. Please also read our{" "}
        <Link href="/privacy">Privacy Policy</Link>, which explains how we handle personal
        information.
      </p>

      <section>
        <h2>1. The Service</h2>
        <p>
          Meetly provides tools for solo hosts to create booking pages, set availability, share
          public links, and let guests schedule meetings. Optional Google Calendar integration can
          block busy times and create calendar events with video meeting links.
        </p>
        <p>
          Meetly is currently offered as an MVP. Features, pricing, and availability may change as
          we improve the product.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old (or the minimum age required in your jurisdiction) to
          use the Service. If you use the Service on behalf of an organization, you represent that
          you have authority to bind that organization to these Terms.
        </p>
      </section>

      <section>
        <h2>3. Host accounts</h2>
        <p>To use host features, you must create an account and provide accurate information. You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your login credentials</li>
          <li>All activity that occurs under your account</li>
          <li>Keeping your profile, availability, and event settings up to date</li>
          <li>Complying with laws that apply to meetings you schedule and data you collect from guests</li>
        </ul>
        <p>
          Notify us promptly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you
          suspect unauthorized access to your account.
        </p>
      </section>

      <section>
        <h2>4. Guest bookings</h2>
        <p>
          Guests may book meetings through public links without creating a Meetly account. When you
          book as a guest, you agree to provide accurate contact information and to use the booking
          flow only for legitimate scheduling purposes.
        </p>
        <p>
          Information you submit as a guest is shared with the host you are booking with. The host
          is responsible for how they use guest information outside of Meetly&apos;s platform
          services, as described in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for unlawful, harmful, or fraudulent purposes</li>
          <li>Attempt to gain unauthorized access to accounts, systems, or data</li>
          <li>Interfere with or disrupt the Service, including by automated scraping or abuse</li>
          <li>Upload malware or content that infringes others&apos; rights</li>
          <li>Misuse booking links to spam, harass, or collect data without a legitimate purpose</li>
          <li>Reverse engineer or attempt to extract source code except where permitted by law</li>
        </ul>
        <p>
          We may suspend or terminate access if we reasonably believe you have violated these Terms
          or pose a risk to the Service or other users.
        </p>
      </section>

      <section>
        <h2>6. Third-party integrations</h2>
        <p>
          The Service may integrate with third-party services such as Google Calendar, Google
          sign-in, and Microsoft sign-in. Your use of those services is subject to the third
          party&apos;s terms and policies. Meetly is not responsible for third-party services.
        </p>
        <p>
          If you connect Google Calendar, you authorize Meetly to access and use calendar data as
          needed to provide scheduling features you enable, including reading busy times and creating
          or deleting events related to bookings.
        </p>
      </section>

      <section>
        <h2>7. Fees and billing</h2>
        <p>
          During the MVP period, core host features may be offered at no charge. We may introduce
          paid plans in the future. If we do, we will provide notice of applicable pricing and
          payment terms before charging you.
        </p>
      </section>

      <section>
        <h2>8. Intellectual property</h2>
        <p>
          Meetly and its branding, software, and content (excluding your content) are owned by
          Meetly or its licensors and are protected by intellectual property laws. We grant you a
          limited, non-exclusive, non-transferable license to use the Service for its intended
          purpose while these Terms remain in effect.
        </p>
        <p>
          You retain ownership of content you submit (such as event descriptions and guest notes you
          provide as a host). You grant Meetly a license to host, display, and process that content
          solely to operate the Service.
        </p>
      </section>

      <section>
        <h2>9. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that the Service will be uninterrupted, error-free, or secure, or that
          meetings scheduled through the Service will occur as planned. Hosts and guests are
          responsible for confirming meeting details and attendance.
        </p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEETLY AND ITS AFFILIATES, OFFICERS, EMPLOYEES,
          AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS OPPORTUNITIES,
          ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
        </p>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEETLY&apos;S TOTAL LIABILITY FOR ANY CLAIM
          ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE GREATER OF
          (A) THE AMOUNTS YOU PAID MEETLY FOR THE SERVICE IN THE TWELVE (12) MONTHS BEFORE THE
          CLAIM OR (B) ONE HUNDRED U.S. DOLLARS (USD $100).
        </p>
        <p>
          Some jurisdictions do not allow certain limitations, so some of the above may not apply to
          you.
        </p>
      </section>

      <section>
        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Meetly from claims, damages, losses, and expenses
          (including reasonable legal fees) arising from your use of the Service, your content, your
          violation of these Terms, or your violation of any law or third-party rights.
        </p>
      </section>

      <section>
        <h2>12. Termination</h2>
        <p>
          You may stop using the Service at any time. We may suspend or terminate your access if you
          violate these Terms or if we discontinue the Service. Upon termination, your right to use
          the Service ends, but sections that by their nature should survive (such as disclaimers,
          limitations of liability, and indemnification) will continue to apply.
        </p>
      </section>

      <section>
        <h2>13. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. We will post the updated Terms on this page
          and update the &quot;Last updated&quot; date. Continued use of the Service after changes
          become effective constitutes acceptance of the revised Terms. If you do not agree to the
          updated Terms, you must stop using the Service.
        </p>
      </section>

      <section>
        <h2>14. Governing law</h2>
        <p>
          These Terms are governed by the laws of the United States and the State of Delaware,
          without regard to conflict-of-law principles, except where mandatory local consumer
          protection laws apply in your jurisdiction.
        </p>
      </section>

      <section>
        <h2>15. Contact</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </>
  );
}
