import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 lg:p-24 flex justify-center">
      <div className="max-w-3xl space-y-8 bg-card text-card-foreground p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: July 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to Life Compass. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you use our application 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. The Data We Collect</h2>
          <p className="leading-relaxed">
            <strong>We do not collect, transmit, or store any of your personal data on our servers.</strong>
          </p>
          <p className="leading-relaxed">
            Life Compass is designed as an entirely "local-first" application. All data you enter into the app 
            (including diary entries, habits, tasks, and meditation counts) is stored locally on your own device 
            using local device storage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
          <p className="leading-relaxed">
            Because all data remains on your device, we do not have access to your data. Your data is only used 
            locally by the app to provide you with the app's features (such as tracking your progress and displaying 
            your diary). We do not use your data for marketing, analytics, or any other external purpose.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Third-Party Access</h2>
          <p className="leading-relaxed">
            We do not share your data with any third parties because we do not collect it in the first place. 
            No third-party analytics or advertising trackers are used within this application that collect personal 
            identifiable information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Data Security</h2>
          <p className="leading-relaxed">
            The security of your data depends on the security of your own device. We recommend keeping your device 
            secure by using a screen lock and keeping your operating system up to date. If you uninstall the app or 
            clear your browser data, your data will be permanently deleted from your device.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this privacy policy, please contact us at: 
            <strong> developer@example.com </strong> 
            <br />
            <em>(Note: Please replace this email with your actual developer email)</em>
          </p>
        </section>
      </div>
    </div>
  );
}
