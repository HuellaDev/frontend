import type { ReactElement } from "react";

export const PrivacyPolicy = (): ReactElement => {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: August 2026</p>
      </div>

      <Section title="What we collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>Account info: email, and anything you add to your profile (name, phone, photo).</li>
          <li>Report info: pet species, breed, color, description, photos, and location for lost/sighting reports.</li>
          <li>Location: only when you explicitly share it (browser geolocation) to create or view reports on the map.</li>
          <li>Device info: if you enable push notifications, we store a technical subscription identifier for your browser.</li>
        </ul>
      </Section>

      <Section title="How we use it">
        <p>
          We use your data to operate Huella: publishing reports, matching lost pets with
          sightings, showing nearby help centers, and sending you notifications about activity
          on your reports.
        </p>
      </Section>

      <Section title="What's shown publicly">
        <p>
          Reports (species, description, photos, and location) are visible to anyone using the
          app. If you add a contact phone to a lost report, that phone number is shown publicly
          on that report so others can reach you.
        </p>
      </Section>

      <Section title="Third parties we use">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Supabase</strong> — authentication, database, and file storage.</li>
          <li><strong>OpenFreeMap</strong> — map tiles (no account data shared).</li>
          <li>
            <strong>Web Push</strong> — if you enable notifications, your browser communicates
            directly with your browser vendor's push service to deliver them.
          </li>
        </ul>
      </Section>

      <Section title="Your choices">
        <ul className="list-disc space-y-1 pl-5">
          <li>Edit or delete your profile info anytime in Settings.</li>
          <li>Delete individual reports you created.</li>
          <li>Disable push notifications from your browser settings at any time.</li>
          <li>Request full account deletion by contacting us.</li>
        </ul>
      </Section>

      <Section title="Data retention">
        <p>
          Sighting reports are automatically archived after 3 days of inactivity, and lost
          reports after 10 days, to keep the map relevant. Archived reports are not deleted
          outright — they remain viewable in the map's history/timeline feature.
        </p>
      </Section>

      <Section title="Contact">
        <p>Questions about your data? Reach out at huella.project@gmail.com.</p>
      </Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: ReactElement }): ReactElement => (
  <section className="space-y-2">
    <h2 className="text-lg font-medium">{title}</h2>
    <div className="text-sm text-muted-foreground">{children}</div>
  </section>
);