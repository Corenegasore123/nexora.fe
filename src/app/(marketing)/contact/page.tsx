"use client";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <p className="eyebrow">Contact</p>
      <h1 className="page-title mt-3">Get in touch</h1>
      <p className="mt-4 text-foreground-secondary">
        For enterprise deployments, methodology customization, or partnership inquiries, reach out
        to our team.
      </p>
      <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
            Name
          </label>
          <input id="name" className="input-field w-full" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
            Email
          </label>
          <input id="email" type="email" className="input-field w-full" />
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
            Message
          </label>
          <textarea id="message" rows={5} className="input-field w-full resize-none" />
        </div>
        <button type="submit" className="btn-primary w-full">
          Send message
        </button>
        <p className="text-xs text-foreground-placeholder">
          Contact form integration coming soon. For now, create an account to explore the platform.
        </p>
      </form>
    </div>
  );
}
