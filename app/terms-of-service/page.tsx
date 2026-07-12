import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout"

export default function TermsOfServicePage() {
  const sections: LegalSection[] = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: (
        <p>
          By accessing or using the Frontend Arena platform (frontendarena.online) and participating in our tournaments (including Frontend Wars 2026), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service or participate in our events.
        </p>
      )
    },
    {
      id: "user-accounts",
      title: "2. User Accounts",
      content: (
        <>
          <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
        </>
      )
    },
    {
      id: "event-participation",
      title: "3. Event Participation Rules",
      content: (
        <ul>
          <li>Participants must register before the official event countdown concludes.</li>
          <li>Unless explicitly stated otherwise (e.g., in team-based tournaments), all submissions must be the work of a single individual.</li>
          <li>We reserve the right to disqualify any participant who attempts to manipulate the judging process or disrupt the platform infrastructure.</li>
        </ul>
      )
    },
    {
      id: "project-submission",
      title: "4. Project Submission Rules",
      content: (
        <>
          <p>All projects submitted to Frontend Arena must adhere to the following strictly enforced criteria:</p>
          <ul>
            <li><strong>Timeline Strictness:</strong> Code must be written during the official tournament window. Pre-existing projects submitted as new work will be disqualified.</li>
            <li><strong>Requirements:</strong> Submissions must include a valid public GitHub repository, a live deployment URL (e.g., Vercel, Netlify), and a demo video.</li>
            <li><strong>Open Source:</strong> By submitting your GitHub link, you acknowledge that your source code may be reviewed by judges and the public.</li>
          </ul>
        </>
      )
    },
    {
      id: "code-of-conduct",
      title: "5. Code of Conduct",
      content: (
        <p>
          Frontend Arena is a community of builders. We expect all participants to conduct themselves professionally and respectfully. Harassment, discrimination, or abusive behavior toward other participants, judges, or staff on our platform, Discord servers, or associated social media will result in an immediate and permanent ban.
        </p>
      )
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property",
      content: (
        <p>
          You retain all ownership rights to the code and projects you build during our tournaments. However, by submitting a project to Frontend Arena, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, display, and distribute your project's name, tagline, screenshots, and demo videos for promotional and historical archive purposes (e.g., the Hall of Fame).
        </p>
      )
    },
    {
      id: "prohibited-activities",
      title: "7. Prohibited Activities",
      content: (
        <>
          <p>The following activities are strictly prohibited during any Frontend Arena tournament:</p>
          <ul>
            <li><strong>Plagiarism:</strong> Forking or copying an existing repository and submitting it as your own original work.</li>
            <li><strong>Excessive AI Generation:</strong> Relying entirely on LLMs to generate the entirety of your project architecture and logic. Code should be primarily human-authored.</li>
            <li><strong>Sabotage:</strong> Attempting to DDoS, hack, or otherwise compromise the Frontend Arena platform or the deployments of competing participants.</li>
          </ul>
        </>
      )
    },
    {
      id: "sponsor-content",
      title: "8. Sponsor & Partner Content",
      content: (
        <p>
          Our Service may contain links to third-party web sites or services (such as InterviewBuddy or UptoSkills) that are not owned or controlled by Frontend Arena. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
        </p>
      )
    },
    {
      id: "account-suspension",
      title: "9. Account Suspension",
      content: (
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service. Upon termination, your right to use the Service will immediately cease.
        </p>
      )
    },
    {
      id: "limitation-of-liability",
      title: "10. Limitation of Liability",
      content: (
        <p>
          In no event shall Frontend Arena, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
      )
    },
    {
      id: "event-modification",
      title: "11. Event Modification Rights",
      content: (
        <p>
          Frontend Arena reserves the right to modify the timeline, prize pools, or rules of any tournament (including Frontend Wars 2026) due to unforeseen circumstances. We will make reasonable efforts to communicate any such changes to all registered participants in a timely manner.
        </p>
      )
    }
  ]

  return (
    <LegalPageLayout 
      title="Terms of Service"
      lastUpdated="July 7, 2026"
      sections={sections}
    />
  )
}
