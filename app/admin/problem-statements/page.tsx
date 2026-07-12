import { ProblemStatementsScreen } from "@/components/admin/screens/ProblemStatements"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin — Problem Statements",
  description: "Upload and publish track-specific challenge documents."
}

export default function AdminProblemStatementsPage() {
  return <ProblemStatementsScreen />
}
