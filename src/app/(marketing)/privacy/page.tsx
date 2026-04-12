export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6 font-heading">Privacy & Security</h1>

      <div className="prose prose-neutral">
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Our Commitment to Privacy</h2>
        <p className="mb-4">
          At CupLog, we take your privacy seriously. This policy describes what personal information we collect and how we use it. Our primary goal is to provide a secure and trustworthy experience for coffee professionals.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">
          We collect the following types of information:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Account Information:</strong> When you create an account, we collect your email and authentication details via OAuth (Google or Discord).</li>
          <li><strong>Cupping Data:</strong> Scores, session metadata, and coffee information you enter during cupping sessions.</li>
          <li><strong>Usage Data:</strong> Information about how you use CupLog, such as features accessed and session frequency.</li>
          <li><strong>Device Information:</strong> Browser and device details used to access the service.</li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Provide and maintain the CupLog service</li>
          <li>Store and retrieve your cupping sessions and scores</li>
          <li>Improve the platform based on usage patterns</li>
          <li>Communicate with you about your account</li>
          <li>Protect against unauthorized access and security threats</li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your data. Your cupping data is stored securely in our database and is only accessible by your account. We do not share your scoring data with third parties.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Data Retention</h2>
        <p className="mb-4">
          We retain your cupping data for as long as your account is active. You may request deletion of your data at any time by contacting us.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Third-Party Services</h2>
        <p className="mb-4">
          CupLog uses Google and Discord for OAuth authentication. We do not share your cupping data with these services. Please review their respective privacy policies for details on how they handle authentication data.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information and cupping data</li>
          <li>Export your cupping data in a structured format</li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us via <a href="mailto:meow@nermalcat69.com" className="text-blue-700 underline">meow@nermalcat69.com</a>.
        </p>
      </div>
    </div>
  );
}
