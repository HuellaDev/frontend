import type { ReactElement } from "react";

export const TermsOfService = (): ReactElement => {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Terms of Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: August 2026</p>
      </div>

      <Section title="What Huella is">
        <p>
          Huella is a community platform to report lost pets and sightings, and connect with
          local help centers. Huella is currently in beta — features and availability may
          change.
        </p>
      </Section>

      <Section title="Your responsibilities">
        <ul className="list-disc space-y-1 pl-5">
          <li>Only post accurate, truthful reports about real lost or sighted animals.</li>
          <li>Don't post content that is offensive, illegal, or violates others' privacy.</li>
          <li>Don't use contact info shared on reports for anything other than helping reunite pets with owners.</li>
          <li>You're responsible for keeping your account credentials secure.</li>
        </ul>
      </Section>

      <Section title="Content you post">
        <p>
          You keep ownership of photos and text you upload. By posting, you allow Huella to
          display that content publicly within the app for the purpose the platform exists for
          (helping find lost pets).
        </p>
      </Section>

      <Section title="No guarantees">
        <p>
          Huella is a tool to help the community connect — we don't guarantee that a lost pet
          will be found, that a sighting is accurate, or that any organization listed on the map
          is currently operating or verified unless marked as such.
        </p>
      </Section>

      <Section title="Account suspension">
        <p>
          We may suspend or remove accounts that post false reports, harass other users, or
          abuse the platform.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms as Huella evolves. Continued use of the app after changes
          means you accept the updated terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>Questions? Reach out at huella.project@gmail.com</p>
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