/**
 * Database row types
 */

/** Represents a user in the system */
export interface User { 
  id: string; 
  full_name: string; 
  team_name?: string; 
  email?: string; 
  avatar_url?: string; 
  role?: string; 
  created_at: string; 
}

/** Represents an event like a hackathon or tournament */
export interface Event { 
  id: string; 
  name: string; 
  description?: string; 
  start_date?: string; 
  end_date: string; 
  status: string; 
  problem_statement?: string; 
  starter_kit_link?: string; 
  figma_link?: string; 
  problem_statement_url?: string; 
  problem_statement_filename?: string; 
  resource_file_url?: string; 
  resource_file_filename?: string; 
  submissions_open?: boolean; 
  tracks?: Track[]; 
}

/** Represents a track within an event */
export interface Track { 
  id: string; 
  name: string; 
  description?: string; 
  event_id?: string; 
}

/** Represents a project submission by a team */
export interface Submission { 
  id: string; 
  participant_id?: string; 
  event_id?: string; 
  team_id?: string; 
  track_id?: string; 
  project_name: string; 
  tagline?: string; 
  description?: string; 
  tech_stack?: string[]; 
  github_url?: string; 
  demo_url?: string; 
  video_url?: string; 
  challenges?: string; 
  key_features?: string; 
  future_improvements?: string; 
  status: string; 
  submitted_at?: string; 
  updated_at?: string; 
  participant_name?: string;
  participant_email?: string;
  users?: Pick<User, 'full_name' | 'team_name' | 'email'>; 
}

/** Represents a problem statement assigned to a track */
export interface ProblemStatement { 
  id: string; 
  track_id: string; 
  file_name: string; 
  file_url: string; 
  published: boolean; 
  created_at: string; 
}

/** Represents a benefit provided by a sponsor */
export interface SponsorBenefit { 
  sponsor_name: string; 
  benefit_type: string; 
  description: string; 
  discount_code?: string; 
}

/** Represents an inquiry made by a potential sponsor */
export interface SponsorInquiry { 
  id?: string; 
  company_name?: string; 
  company?: string; 
  contact_email?: string; 
  email?: string; 
  contact_name?: string; 
  first_name?: string; 
  last_name?: string; 
  tier?: string; 
  message?: string; 
  created_at?: string; 
}

/**
 * Mapped/transformed types used in admin pages
 */

/** Represents submission data specifically transformed for admin views */
export interface AdminSubmission { 
  id: string; 
  user: string; 
  track: string; 
  status: string; 
  submitted: string; 
  repo: string; 
  demo: string; 
}

/** Represents participant data specifically transformed for admin views */
export interface AdminParticipant { 
  id: string; 
  name: string; 
  email: string; 
  joined: string; 
  status: string; 
}

/** Represents system statistics for the admin dashboard */
export interface AdminStats { 
  error?: string;
  participantsCount: number; 
  submissionsCount: number; 
  recentSubmissions: Array<{ 
    id: string; 
    project_name: string; 
    status: string; 
    updated_at: string; 
    users: { full_name?: string } | Array<{ full_name?: string }> | null; 
  }>; 
}

/**
 * Dashboard types
 */

/** Represents the aggregated data shown on the user dashboard */
export interface DashboardData { 
  fullName: string; 
  teamName: string; 
  submissionStatus: string; 
  event: { 
    name: string; 
    problem_statement: string; 
    starter_kit_link: string; 
    figma_link: string; 
    end_date: string; 
    problem_statement_url: string; 
    problem_statement_filename: string; 
    resource_file_url: string; 
    resource_file_filename: string; 
  }; 
}

/**
 * File update field types for admin operations
 */

/** Represents fields used when updating event files */
export interface EventFileFields { 
  problem_statement_url?: string | null; 
  problem_statement_filename?: string | null; 
  resource_file_url?: string | null; 
  resource_file_filename?: string | null; 
}

/** Participant track info */
export interface ParticipantTrack {
  id: string;
  name: string;
  description?: string;
}

/** Problem statement file format for dashboard listing */
export interface ProblemStatementFile {
  id: string;
  track_id?: string;
  title?: string;
  description?: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  published?: boolean;
  published_at?: string;
  created_at?: string;
}

/** Leaderboard entry format */
export interface LeaderboardEntry {
  id: string;
  team_name?: string;
  team?: string;
  project?: string;
  score?: number;
  rank?: number;
  track?: string;
  tier?: string;
}

/** Hall of Fame winner format */
export interface HallOfFameWinner {
  id?: string;
  name?: string;
  winner?: string;
  project?: string;
  title?: string;
  rank?: string;
  avatar?: string;
  year?: string;
}

/** Represents an approved participant whitelisted from Unstop */
export interface ApprovedParticipant {
  id: string;
  email: string;
  registered: boolean;
  registered_at?: string | null;
  created_at: string;
}


