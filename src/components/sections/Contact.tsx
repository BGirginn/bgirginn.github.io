"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { track } from "@vercel/analytics";
import { Container } from "@/components/ui/Container";
import { FormField } from "@/components/ui/FormField";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";
import { contactSchema, type ContactPayload } from "@/lib/contact-schema";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactPayload) {
    setStatus("idle");

    try {
      const subject = encodeURIComponent(`Project inquiry from ${values.name}`);
      const body = encodeURIComponent(
        `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
      );

      window.location.href = `mailto:${siteContent.brand.email}?subject=${subject}&body=${body}`;
      track("contact_submit", { status: "success" });
      setStatus("success");
      reset();
      return;
    } catch {
      track("contact_submit", { status: "error" });
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="site-section contact-section relative min-h-screen py-24 md:flex md:items-center md:pt-[calc(var(--header-height)+44px)] md:pb-10"
    >
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5" data-reveal>
            <SectionLabel number="06">Contact</SectionLabel>
            <h2 className="section-title max-w-[13ch]">
              {siteContent.contact.title}
            </h2>
            <p className="mt-5 max-w-xl text-[clamp(16px,1.2vw,18px)] leading-8 text-[var(--color-muted)]">
              {siteContent.contact.description}
            </p>
            <a
              className="contact-address"
              href={`mailto:${siteContent.brand.email}`}
            >
              {siteContent.brand.email}
            </a>
            <p className="technical-caption mt-8">
              Hardware / Firmware / Technical review
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <form
              className="contact-console grid gap-5 p-5 md:p-6 lg:p-7"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="console-heading">
                <span>Project inquiry</span>
                <span>EMAIL DRAFT</span>
              </div>
              <FormField
                label="Name"
                registration={register("name")}
                error={errors.name}
              />
              <FormField
                label="Email"
                registration={register("email")}
                error={errors.email}
              />
              <FormField
                label="Message"
                registration={register("message")}
                error={errors.message}
                multiline
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="hud-button hud-button-primary gap-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {isSubmitting ? "Preparing..." : "Prepare Email"}
              </button>
              <p className="technical-caption">
                Opens your email app with a draft.
              </p>
              <div aria-live="polite" className="min-h-6 text-sm">
                {status === "success" ? (
                  <span className="text-[var(--color-gold-light)]">
                    {siteContent.contact.success}
                  </span>
                ) : null}
                {status === "error" ? (
                  <span className="text-[var(--color-gold-light)]">
                    {siteContent.contact.error}
                  </span>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
