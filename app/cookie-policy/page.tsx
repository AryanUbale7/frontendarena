import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout"

export default function CookiePolicyPage() {
  const sections: LegalSection[] = [
    {
      id: "what-are-cookies",
      title: "1. What Cookies Are",
      content: (
        <p>
          Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you. Cookies can be "persistent" or "session" cookies.
        </p>
      )
    },
    {
      id: "types-of-cookies",
      title: "2. Types of Cookies Used",
      content: (
        <p>
          When you use and access the Frontend Arena platform, we may place a number of cookie files in your web browser. We use both session and persistent cookies to run the Service, and we use different types of cookies to operate the platform effectively.
        </p>
      )
    },
    {
      id: "essential-cookies",
      title: "3. Essential Cookies",
      content: (
        <p>
          These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website, such as the Participant Dashboard and the Submission Portal. Our authentication provider (Supabase) relies on these cookies to keep your session active securely. Without these cookies, the core functionality of the platform would fail.
        </p>
      )
    },
    {
      id: "analytics-cookies",
      title: "4. Analytics Cookies",
      content: (
        <p>
          We use analytics cookies (e.g., Google Analytics) to track information about how the Service is used so that we can make improvements. We may also use analytics cookies to test new pages, features, or new functionality of the Service to see how our users react to them. This data is aggregated and anonymized.
        </p>
      )
    },
    {
      id: "performance-cookies",
      title: "5. Performance Cookies",
      content: (
        <p>
          These cookies are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name (e.g., on your dashboard), and remember your preferences (for example, your choice of language, region, or UI theme settings).
        </p>
      )
    },
    {
      id: "third-party-cookies",
      title: "6. Third-Party Cookies",
      content: (
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service. For instance, embedded demo videos from YouTube or content from our sponsors (InterviewBuddy, UptoSkills) may place their own cookies in your browser when you interact with those specific elements.
        </p>
      )
    },
    {
      id: "cookie-management",
      title: "7. Cookie Management",
      content: (
        <p>
          If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages (specifically the authenticated Participant Dashboard) might not display properly.
        </p>
      )
    },
    {
      id: "user-choices",
      title: "8. User Choices",
      content: (
        <p>
          We believe in providing you with transparency and control over your data. While essential cookies cannot be disabled without breaking the platform, you may opt-out of non-essential analytics cookies through the cookie banner provided upon your first visit, or by using browser extensions designed to block analytics trackers.
        </p>
      )
    }
  ]

  return (
    <LegalPageLayout 
      title="Cookie Policy"
      lastUpdated="July 7, 2026"
      sections={sections}
    />
  )
}
