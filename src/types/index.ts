import type { Timestamp } from "firebase/firestore";

export type Club = {
  id: string;
  name: string;
  slug: string;
  ownerId?: string;
  logo: string;
  banner: string;
  description: string;
  city: string;
  region: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  website: string;
  foundationDate: Timestamp;
  proballersUrl?: string;
  social?: {
    facebookPageId?: string;
    facebookAccessToken?: string;
    instagramBusinessId?: string;
  };
  customDomain?: string;
  published: boolean;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ClubHistory = {
  id?: string;
  clubId: string;
  history: string;
  mission: string;
  vision: string;
  foundationDate?: Timestamp;
  updatedAt?: Timestamp;
};

export type TimelineEvent = {
  id?: string;
  clubId: string;
  year: number;
  title: string;
  description: string;
  image?: string;
  order: number;
  createdAt: Timestamp;
};

export type Achievement = {
  id?: string;
  clubId: string;
  year: number;
  title: string;
  description: string;
  icon?: string;
  position: number;
  createdAt: Timestamp;
};

export type Player = {
  id: string;
  clubId: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  age: number;
  height: string;
  weight: string;
  photo: string;
  bio: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type PlayerStats = {
  playerId: string;
  season: string;
  gamesPlayed: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointsMade: number;
  threePointsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  turnovers: number;
  fouls: number;
  efficiencyRating: number;
  trueShootingPercentage: number;
  updatedAt: Timestamp;
};

export type MatchStatus = "upcoming" | "live" | "finished" | "cancelled";

export type Match = {
  id: string;
  clubId: string;
  opponent: string;
  opponentLogo?: string;
  date: Timestamp;
  location: string;
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  ticketUrl?: string;
  streamUrl?: string;
  competition: string;
  season: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type MVPVote = {
  matchId: string;
  playerId: string;
  userFingerprint: string;
  userId?: string;
  createdAt: Timestamp;
};

export type MVPResult = {
  matchId: string;
  playerId: string;
  playerName: string;
  playerNumber: number;
  voteCount: number;
  votePercentage: number;
  totalVotes: number;
  calculatedAt: Timestamp;
};

export type Poll = {
  clubId: string;
  title: string;
  options: PollOption[];
  startDate: Timestamp;
  endDate: Timestamp;
  active: boolean;
  type: "general" | "player" | "season";
  createdAt: Timestamp;
};

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Prediction = {
  clubId: string;
  matchId: string;
  userId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  points: number;
  exactScore: boolean;
  createdAt: Timestamp;
};

export type MemberStatus = "pending" | "approved" | "inactive" | "rejected";

export type Member = {
  id: string;
  clubId: string;
  name: string;
  rut: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: Timestamp;
  membershipType: "basic" | "premium" | "vip";
  status: MemberStatus;
  monthlyAmount: number;
  totalPaid: number;
  lastPayment?: Timestamp;
  lastPaymentDate?: Timestamp;
  startDate: Timestamp;
  endDate?: Timestamp;
  nextDueDate?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Payment = {
  id: string;
  memberId: string;
  clubId: string;
  amount: number;
  paymentDate: Timestamp;
  paymentMethod: "transferencia" | "efectivo" | "tarjeta" | "otro";
  notes?: string;
  periodStart?: Timestamp;
  periodEnd?: Timestamp;
  createdAt: Timestamp;
};

export type News = {
  id: string;
  clubId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Product = {
  id: string;
  clubId: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  category: "clothing" | "accessories" | "equipment" | "other";
  sizes?: string[];
  colors?: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type SponsorTier = "gold" | "silver" | "bronze";
export type ContributionType = "monetario" | "servicio" | "producto";

export type Sponsor = {
  id: string;
  clubId: string;
  name: string;
  logo: string;
  website: string;
  tier: SponsorTier;
  description?: string;
  contributionType: ContributionType;
  contributionAmount: number;
  contributionCurrency: "CLP" | "USD";
  complianceStatus: "pendiente" | "cumpliendo" | "incumplido";
  complianceNotes?: string;
  active: boolean;
  startDate: Timestamp;
  endDate?: Timestamp;
  impressions: number;
  clicks: number;
  ctr: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type TeamStats = {
  clubId: string;
  season: string;
  wins: number;
  losses: number;
  winPercentage: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifference: number;
  position: number;
  lastFive: ("W" | "L")[];
  homeRecord: { wins: number; losses: number };
  awayRecord: { wins: number; losses: number };
  streak: number;
  updatedAt: Timestamp;
};

export type UserRole = "superadmin" | "club_admin" | "editor" | "viewer";

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  roles: {
    superadmin: boolean;
      clubs: Record<string, UserRole>;
    };
    createdAt: Timestamp;
  };


