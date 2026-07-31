import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions - Nomad Bikers Club" },
      { name: "description", content: "Terms governing use of nomadbikersclub.in and participation in Nomad Bikers Club training programs, rides, tours and events." },
      { property: "og:title", content: "Terms & Conditions - Nomad Bikers Club" },
      { property: "og:description", content: "Eligibility, bookings, conduct, liability and governing law for Nomad Bikers Club services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
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

function Terms() {
  return (
    <section className="pt-32 sm:pt-40 pb-20 sm:pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary mb-3">Legal</div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold">
            Terms &amp; <span className="text-gradient">Conditions</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Effective Date: July 29, 2026 · Last Updated: July 29, 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 sm:p-10 mt-10 shadow-elevated">
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            Welcome to Nomad Bikers Club ("Nomad Bikers Club", "we", "our", or "us"). These Terms &amp; Conditions ("Terms") govern your access to and use of www.nomadbikersclub.in and all services offered by Nomad Bikers Club, including motorcycle training programs, workshops, tours, community rides, events, and related experiences.
          </p>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
            By accessing our website, making an enquiry, registering for a program, making a payment, or participating in any of our services, you agree to be bound by these Terms &amp; Conditions.
          </p>

          <Section title="1. Eligibility">
            <p>To participate in our services, you must:</p>
            <List items={[
              "Provide accurate and complete information during registration.",
              "Meet the eligibility requirements of the selected program.",
              "Hold a valid Driving Licence or Learner's Licence where required by law.",
              "Follow all instructions provided by our instructors and staff.",
              "Comply with applicable traffic laws and regulations.",
            ]} />
            <p>Nomad Bikers Club reserves the right to refuse participation if these requirements are not met.</p>
          </Section>

          <Section title="2. Our Services">
            <p>Nomad Bikers Club offers motorcycle related experiences including, but not limited to:</p>
            <List items={[
              "Motorcycle training programs",
              "Personal coaching sessions",
              "Riding workshops",
              "Community rides",
              "Motorcycle tours",
              "Educational events and experiences",
            ]} />
            <p>Program schedules, instructors, locations, motorcycles, and training content may change when reasonably necessary to ensure safety or operational efficiency.</p>
          </Section>

          <Section title="3. Bookings & Payments">
            <p>Bookings may be made through our website, WhatsApp, Instagram, email, phone, or any official Nomad Bikers Club communication channel.</p>
            <p>A booking is considered confirmed only after the required registration details have been received and payment has been successfully completed or otherwise confirmed by Nomad Bikers Club.</p>
            <p>All pricing is subject to change until a booking has been confirmed.</p>
          </Section>

          <Section title="4. Cancellation & Refunds">
            <p>Our cancellation, rescheduling, and refund practices are governed by our Refund &amp; Cancellation Policy, which forms an integral part of these Terms &amp; Conditions.</p>
            <p>By completing a booking, you acknowledge that you have read and agreed to that policy.</p>
          </Section>

          <Section title="5. Participant Conduct & Responsibilities">
            <p>To help maintain a safe and enjoyable learning environment, participants agree to:</p>
            <List items={[
              "Follow all instructions provided by instructors and staff.",
              "Treat fellow participants, instructors, staff, and members of the public with respect.",
              "Ride responsibly and within their level of experience.",
              "Wear all required safety gear during training and riding activities.",
              "Inform us of any relevant medical condition or injury that may affect safe participation.",
              "Immediately report any accident, injury, unsafe condition, or mechanical concern.",
              "Comply with all applicable traffic laws and safety regulations.",
            ]} />
            <p>Participants are expected to conduct themselves responsibly throughout the duration of the program.</p>
          </Section>

          <Section title="6. Right to Refuse Service">
            <p>Nomad Bikers Club reserves the right to refuse, suspend, or terminate participation in any program or service if a participant:</p>
            <List items={[
              "Engages in unsafe, reckless, unlawful, or irresponsible behaviour.",
              "Fails to follow instructor directions or established safety procedures.",
              "Harasses, threatens, or behaves abusively towards staff or other participants.",
              "Damages motorcycles, equipment, or property through intentional misuse or negligence.",
              "Provides false or misleading information during registration.",
              "Acts in a manner that compromises the safety, wellbeing, or experience of others.",
            ]} />
            <p>Where applicable, refunds or rescheduling will be handled in accordance with our Refund &amp; Cancellation Policy.</p>
          </Section>

          <Section title="7. Assumption of Risk & Limitation of Liability">
            <p>Motorcycling and related activities involve inherent risks that cannot be completely eliminated, even when appropriate safety measures are followed.</p>
            <p>By participating in our services, you acknowledge these inherent risks and agree to participate voluntarily.</p>
            <p>To the fullest extent permitted under applicable law, Nomad Bikers Club, its founders, instructors, employees, contractors, volunteers, and partners shall not be liable for any indirect, incidental, consequential, or special loss or damage arising from the use of our website or participation in our services.</p>
            <p>Nothing in these Terms excludes any liability that cannot legally be excluded under applicable law.</p>
            <p>Participants may also be required to sign a separate Training Participation Agreement &amp; Liability Waiver before participating in certain activities.</p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All content available on this website, including but not limited to our logo, branding, text, graphics, photographs, videos, course materials, designs, and other intellectual property, is owned by or licensed to Nomad Bikers Club unless otherwise stated.</p>
            <p>You may not copy, reproduce, distribute, modify, publish, or commercially exploit any content from this website without our prior written permission.</p>
          </Section>

          <Section title="9. Changes to these Terms">
            <p>We may update these Terms &amp; Conditions from time to time to reflect changes in our business, services, or legal requirements.</p>
            <p>The latest version will always be published on our website with the updated "Last Updated" date. Continued use of our website or services after such changes constitutes acceptance of the revised Terms.</p>
          </Section>

          <Section title="10. Governing Law">
            <p>These Terms &amp; Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the competent courts in Coimbatore, Tamil Nadu, unless otherwise required by applicable law.</p>
          </Section>
        </motion.div>
      </div>
    </section>
  );
}