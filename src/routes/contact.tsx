import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Send } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { submitForm } from "@/lib/form-submissions.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Nomad Bikers Club" },
      { name: "description", content: "Reach Nomad Bikers Club for bookings, partnerships or general queries." },
      { property: "og:title", content: "Contact us" },
      { property: "og:description", content: "Email, phone, and location." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  message: z.string().trim().min(10, "Enter a message of at least 10 characters").max(1000),
});

const inputCls = "w-full px-4 py-3.5 rounded-xl bg-secondary/60 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition";

function Contact() {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitContact = useServerFn(submitForm);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const r = schema.safeParse(data);
    if (!r.success) {
      const o: Record<string, string> = {};
      r.error.issues.forEach(i => o[i.path[0] as string] = i.message);
      setErrs(o); return;
    }
    setErrs({});
    setSubmitError("");
    setSending(true);
    try {
      const result = await submitContact({
        data: {
          formType: "contact",
          payload: r.data,
          website: String(fd.get("website") ?? ""),
        },
      });
      if (!result.ok) {
        setErrs(Object.fromEntries(result.errors.map(({ field, message }) => [field, message])));
        return;
      }
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "We couldn't send your message. Please try again.";
      setSubmitError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className="pt-32 sm:pt-40 pb-10 sm:pb-12 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Get in Touch</div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold">Let's <span className="text-gradient">ride together.</span></h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: Phone, t: "Call us", v: "+91 90870 30060", href: "tel:+919087030060" },
              { icon: Mail, t: "Email", v: "support@nomadbikersclub.in", href: "mailto:support@nomadbikersclub.in" },
              { icon: Instagram, t: "Instagram", v: "@nomadbikersclub", href: "https://www.instagram.com/nomadbikersclub" },
              { icon: MapPin, t: "Location", v: "India - see Google Business Profile", href: "https://share.google/fD21aLl2q4ggqwhe4" },
            ].map((c, i) => (
              <motion.a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 glass rounded-2xl p-5 hover:shadow-glow transition group">
                <div className="p-3 rounded-xl bg-ember-gradient text-primary-foreground"><c.icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.t}</div>
                  <div className="font-semibold mt-0.5">{c.v}</div>
                </div>
              </motion.a>
            ))}
            <div className="rounded-2xl overflow-hidden glass shadow-elevated mt-6">
              <iframe
                title="Nomad Bikers Club location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1813367.7814872696!2d77.3750450136446!3d18.2055321154827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6beefbab05b5b287%3A0xc6d3189a832addfe!2sNomad%20Bikers%20Club!5e0!3m2!1sen!2sin!4v1781102486514!5m2!1sen!2sin"
                className="w-full h-[260px] sm:h-[360px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass rounded-3xl p-6 md:p-8 shadow-elevated space-y-5">
            <h3 className="font-display text-2xl font-bold">Send a message</h3>
            <label className="sr-only" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <label className="block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Name</div>
              <input name="name" className={inputCls} />
              {errs.name && <p className="text-xs text-destructive mt-1">{errs.name}</p>}
            </label>
            <label className="block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</div>
              <input name="email" type="email" className={inputCls} />
              {errs.email && <p className="text-xs text-destructive mt-1">{errs.email}</p>}
            </label>
            <label className="block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Message</div>
              <textarea name="message" rows={5} className={inputCls} />
              {errs.message && <p className="text-xs text-destructive mt-1">{errs.message}</p>}
            </label>
            <button disabled={sending} className="w-full inline-flex justify-center items-center gap-2 px-6 py-4 rounded-full bg-ember-gradient text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition disabled:opacity-60">
              {sending ? "Sending..." : sent ? "Thank you! We'll get back to you shortly." : <>Send message <Send className="h-4 w-4" /></>}
            </button>
            {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
          </motion.form>
        </div>
      </section>
    </>
  );
}
