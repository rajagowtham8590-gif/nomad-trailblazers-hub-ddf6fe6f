import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import { sendFormNotification } from "./email.server";
import { getEnv } from "./env.server";

const phoneSchema = z.string().trim().regex(/^[+\d\s().-]{8,20}$/, "Enter a valid phone number");
const emailSchema = z.string().trim().email("Enter a valid email").max(160);

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: emailSchema,
  message: z.string().trim().min(10, "Enter a message of at least 10 characters").max(1000),
});

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: phoneSchema,
  email: emailSchema,
  city: z.string().trim().min(2, "Enter your city").max(80),
  service: z.enum(["beginner", "pt", "regular", "getaway"]),
  comfort: z.enum(["yes", "no"]),
});

const careerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: phoneSchema,
  city: z.string().trim().min(2, "Enter your city").max(80),
  email: emailSchema,
  instagram: z.string().trim().min(1, "Share your Instagram handle").max(60),
  experience: z.coerce.number().int().min(0, "Enter years of experience").max(60),
});

const submissionSchema = z.object({
  formType: z.enum(["contact", "booking", "career_application"]),
  payload: z.record(z.string(), z.unknown()),
  website: z.string().max(200).optional(),
});

export const submitForm = createServerFn({ method: "POST" })
  .validator((input) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website?.trim()) return { ok: true, spam: true };

    const schemas = {
      contact: contactSchema,
      booking: bookingSchema,
      career_application: careerSchema,
    } as const;
    const validation = schemas[data.formType].safeParse(data.payload);
    if (!validation.success) {
      return {
        ok: false,
        errors: validation.error.issues.map((issue) => ({
          field: String(issue.path[0] ?? "form"),
          message: issue.message,
        })),
      };
    }

    const url = getEnv(
      "SUPABASE_URL",
      "https://c--fd513ce2-a33c-42d7-b96b-e3c670b402ff-prod.lovable.cloud"
    );
    const key = getEnv(
      "SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_DK9GBivH5TbaNvr-nTeJXg_dhNE01L5"
    );
    if (!url || !key) throw new Error("Form submission is temporarily unavailable.");

    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("form_submissions").insert({
      form_type: data.formType,
      payload: validation.data,
    });

    if (error) {
      console.error("[Supabase Error]", error);
      throw new Error(error.message || "We couldn't save your submission. Please try again.");
    }

    // Send email notification to support@nomadbikersclub.in
    try {
      await sendFormNotification({
        formType: data.formType,
        payload: validation.data,
      });
    } catch (emailError) {
      console.error("[Form Submissions] Failed to send email notification:", emailError);
      // We don't abort the user's successfully saved submission if SMTP is temporarily down,
      // but if SMTP is strictly required, the log records the incident.
    }

    return { ok: true, spam: false };
  });