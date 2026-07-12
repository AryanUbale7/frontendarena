import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout"

export default function PrivacyPolicyPage() {
  const sections: LegalSection[] = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: (
        <>
          <p>
            Frontend Arena ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (frontendarena.online) and tell you about your privacy rights and how the law protects you.
          </p>
          <p>
            By participating in Frontend Wars 2026 or any other tournaments hosted on our platform, you agree to the collection and use of information in accordance with this policy.
          </p>
        </>
      )
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      content: (
        <>
          <p>We collect various types of information in connection with the services we provide, including:</p>
          <ul>
            <li><strong>Personal Identification Data:</strong> Full Name, Email Address.</li>
            <li><strong>Event Registration Data:</strong> Registration status, participant roles, team names (if applicable).</li>
            <li><strong>Project Submission Data:</strong> Project names, taglines, long-form descriptions, and technology stacks.</li>
            <li><strong>External Links:</strong> Public GitHub Repository URLs, Live Deployment URLs, and Video Submission Links (e.g., YouTube, Google Drive).</li>
          </ul>
        </>
      )
    },
    {
      id: "how-we-use-information",
      title: "3. How We Use Information",
      content: (
        <>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Facilitate your participation in Frontend Arena tournaments and events.</li>
            <li>Evaluate and score your project submissions based on our judging rubrics.</li>
            <li>Maintain a public leaderboard and Hall of Fame for tournament winners.</li>
            <li>Send you important event updates, deadlines, and administrative messages.</li>
            <li>Distribute sponsor benefits, discounts, and prizes.</li>
          </ul>
        </>
      )
    },
    {
      id: "data-protection",
      title: "4. Data Protection",
      content: (
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
        </p>
      )
    },
    {
      id: "third-party-services",
      title: "5. Third Party Services",
      content: (
        <>
          <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. These include:</p>
          <ul>
            <li><strong>Supabase:</strong> For database hosting, authentication, and secure data storage.</li>
            <li><strong>Google Analytics:</strong> To monitor and analyze the use of our Service.</li>
            <li><strong>Email Services:</strong> To manage and send transactional and marketing emails securely.</li>
          </ul>
        </>
      )
    },
    {
      id: "event-participation",
      title: "6. Event Participation Data",
      content: (
        <p>
          Please note that by submitting a project to Frontend Wars 2026, certain data becomes part of the public record. Your Project Name, Tagline, GitHub Link, and Deployment Link may be displayed publicly on our Leaderboard, Hall of Fame, and promotional materials. We celebrate open-source development, and your project data is treated as public portfolio material once submitted.
        </p>
      )
    },
    {
      id: "sponsor-communications",
      title: "7. Sponsor Communications",
      content: (
        <p>
          We partner with organizations like InterviewBuddy and UptoSkills to provide you with exclusive benefits. We do not sell your personal data to these sponsors. However, if you choose to redeem a sponsor benefit, you may be required to share your information directly with them according to their respective privacy policies.
        </p>
      )
    },
    {
      id: "data-retention",
      title: "8. Data Retention",
      content: (
        <p>
          We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. Project submissions and Hall of Fame records are retained indefinitely as part of the historical archive of Frontend Arena, unless deletion is explicitly requested by the user.
        </p>
      )
    },
    {
      id: "user-rights",
      title: "9. User Rights",
      content: (
        <>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
          </ul>
        </>
      )
    },
    {
      id: "policy-updates",
      title: "10. Policy Updates",
      content: (
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
        </p>
      )
    },
  ]

  return (
    <LegalPageLayout 
      title="Privacy Policy"
      lastUpdated="July 7, 2026"
      sections={sections}
    />
  )
}
