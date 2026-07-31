import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund, Cancellation & Rescheduling Policy - Nomad Bikers Club" },
      { name: "description", content: "How Nomad Bikers Club handles booking confirmation, rescheduling, no-shows, cancellations and refunds for training programs and rides." },
      { property: "og:title", content: "Refund, Cancellation & Rescheduling Policy" },
      { property: "og:description", content: "Fair, transparent rules for rescheduling and refunds on Nomad Bikers Club bookings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefundPolicy,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

function RefundPolicy() {
  return (
    <section className="pt-32 sm:pt-40 pb-20 sm:pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary mb-3">Legal</div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold">
            Refund, Cancellation &amp; <span className="text-gradient">Rescheduling</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Effective Date: July 29, 2026 · Last Updated: July 29, 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 sm:p-10 mt-10 shadow-elevated">
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            At Nomad Bikers Club, we understand that life doesn't always go according to plan. Unexpected situations, injuries, family emergencies, work commitments, and other unforeseen circumstances can sometimes make it difficult to attend a scheduled training session.
          </p>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
            Our goal has never been to make things difficult for our participants. Whenever reasonably possible, we do our best to accommodate genuine situations with fairness, understanding, and flexibility.
          </p>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
            At the same time, every training session requires significant planning, including trainer availability, motorcycles, riding gear, logistics, venue coordination, and limited participant slots. Last-minute changes affect not only our team but also other riders waiting to join our programs.
          </p>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
            By confirming a booking or making any payment for a Nomad Bikers Club program or service, you acknowledge that you have read, understood, and agreed to this Refund, Cancellation &amp; Rescheduling Policy.
          </p>

          <Section title="1. Booking Confirmation">
            <p>A booking is confirmed only after the required booking amount has been received by Nomad Bikers Club.</p>
            <p>Unless otherwise agreed, full payment is required to secure your slot. In certain cases, we may accept a partial advance payment or a minimum booking amount of ₹1,000. This booking amount is non-refundable and is used to reserve your place in the selected program.</p>
          </Section>

          <Section title="2. Booking Validity">
            <p>Every booking is generally valid for two (2) months from the originally scheduled training date.</p>
            <p>If you are unable to attend due to a genuine medical emergency, injury, pregnancy, family emergency, or other exceptional circumstances, we will make reasonable efforts to accommodate you within or beyond the validity period, where possible.</p>
            <p>Extensions beyond the validity period are not automatic and will be considered on a case-by-case basis based on:</p>
            <List items={["The reason for the request.", "Trainer availability.", "Batch availability.", "Operational feasibility."]} />
          </Section>

          <Section title="3. Rescheduling Your Training">
            <p>We understand that plans can change.</p>
            <p>Participants may request up to three (3) reschedules within the booking validity period, subject to trainer availability, batch capacity, and operational feasibility.</p>
            <p>We encourage participants to notify us as early as possible if they are unable to attend.</p>
            <p>Repeated postponements, prolonged inactivity, or failure to communicate may result in the booking becoming inactive.</p>
          </Section>

          <Section title="4. Genuine Emergencies">
            <p>We recognise that some situations are beyond anyone's control. Examples include (but are not limited to):</p>
            <List items={[
              "Medical emergencies",
              "Physical injuries",
              "Pregnancy",
              "Family emergencies",
              "Unexpected work commitments",
              "Relocation",
              "Other exceptional circumstances",
            ]} />
            <p>Whenever reasonably possible, we will first explore rescheduling your training before considering any other option.</p>
            <p>Each request is reviewed individually, with fairness to both the participant and our operational commitments.</p>
          </Section>

          <Section title="5. No-Shows & Late Arrivals">
            <p>If you do not attend your scheduled session without prior notice, arrive after the session has substantially commenced, or remain unreachable without communication, the session may be treated as a No-Show.</p>
            <p>Repeated no-shows or failure to respond for more than 60 days may result in the booking being considered inactive.</p>
            <p>Any future accommodation after this period will be entirely at the discretion of Nomad Bikers Club.</p>
          </Section>

          <Section title="6. Personal Training">
            <p>Personal training slots are reserved exclusively for individual participants and require dedicated trainer time.</p>
            <p>If a personal training program is interrupted for an extended period, resuming the remaining sessions may not always be practical due to changes in trainer schedules, curriculum progression, and operational planning.</p>
            <p>Where appropriate, Nomad Bikers Club may require participants to restart the training program upon their return. In such cases, a reasonable Program Restart Fee may apply. The applicable fee will depend on the duration of the interruption and the remaining training requirements.</p>
          </Section>

          <Section title="7. Group Training">
            <p>Participants who are unable to attend their scheduled group batch may request to join a future batch, subject to seat availability.</p>
            <p>Requests to transfer to another city or a later batch may also be accommodated where reasonably possible.</p>
            <p>Private catch-up sessions are generally not included as part of a group training program.</p>
          </Section>

          <Section title="8. Cancellations by Nomad Bikers Club">
            <p>In certain situations, Nomad Bikers Club may postpone or cancel a program due to circumstances beyond our reasonable control, including:</p>
            <List items={[
              "Severe weather conditions",
              "Safety concerns",
              "Insufficient registrations",
              "Instructor unavailability",
              "Operational constraints",
            ]} />
            <p>Where this occurs, participants will be offered one of the following, depending on the circumstances:</p>
            <List items={[
              "A rescheduled session;",
              "A booking credit for a future program; or",
              "A refund, where appropriate.",
            ]} />
          </Section>

          <Section title="9. Refunds">
            <p>We understand that plans can change. To ensure fairness to both our participants and our team, the following refund policy applies to all bookings unless otherwise agreed in writing.</p>
            <h3 className="font-semibold text-foreground pt-2">Cancellation more than 7 days before the scheduled training</h3>
            <p>If you cancel your booking more than seven (7) calendar days before your scheduled training date, you will be eligible for a refund after deducting the applicable non-refundable booking amount.</p>
            <h3 className="font-semibold text-foreground pt-2">Cancellation between 1 and 7 days before the scheduled training</h3>
            <p>If you cancel your booking between one (1) and seven (7) calendar days before your scheduled training date, you will be eligible for a 50% refund of the total program fee. Any non-refundable booking amount paid will be retained by Nomad Bikers Club.</p>
            <h3 className="font-semibold text-foreground pt-2">Last-minute cancellations</h3>
            <p>No refund will be provided for:</p>
            <List items={[
              "Cancellations made within 24 hours of the scheduled training session.",
              "Failure to attend a scheduled session without prior notice (No-Show).",
              "Arriving after the session has substantially commenced, making participation impractical.",
            ]} />
            <h3 className="font-semibold text-foreground pt-2">Duplicate Payments</h3>
            <p>If you accidentally make the same payment more than once, the duplicate payment will be refunded after verification.</p>
            <h3 className="font-semibold text-foreground pt-2">Refund Processing</h3>
            <p>Approved refunds will be processed within 15 to 30 working days through the original payment method, wherever reasonably possible.</p>
          </Section>

          <Section title="10. Our Commitment">
            <p>We believe that policies should protect both our participants and our team.</p>
            <p>If you ever find yourself in an unexpected situation, we encourage you to speak with us. While we cannot promise every request can be accommodated, we promise to review each genuine case with fairness, empathy, and transparency.</p>
            <p>Our aim is not simply to enforce rules, but to ensure that every decision is fair to you, our instructors, and the wider Nomad Bikers Club community.</p>
          </Section>
        </motion.div>
      </div>
    </section>
  );
}