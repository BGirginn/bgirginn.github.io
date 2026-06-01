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
      data-scroll-lock
      className="relative min-h-screen py-20 md:flex md:items-center md:pt-[calc(var(--header-height)+44px)] md:pb-10"
    >
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionLabel>Contact</SectionLabel>
            <h2 className="max-w-[10ch] text-[clamp(38px,4.6vw,64px)] font-semibold leading-[1.04]">
              {siteContent.contact.title}
            </h2>
            <p className="mt-5 max-w-xl text-[clamp(16px,1.2vw,18px)] leading-8 text-[var(--color-muted)]">
              {siteContent.contact.description}
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <form
              className="soft-panel grid gap-5 p-5 md:p-6 lg:max-h-[calc(100dvh-170px)] lg:p-7"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
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
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 border border-[var(--color-gold)] bg-[var(--color-gold)] px-6 text-sm font-semibold text-[#0A0F14] transition-colors duration-200 hover:bg-[var(--color-gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
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
