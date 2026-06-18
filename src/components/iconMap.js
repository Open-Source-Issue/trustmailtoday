import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Ban,
  MailCheck,
  ScanText,
  Wand2,
  AtSign,
  PenLine,
  Wrench,
  TrendingUp,
  Gauge,
  Inbox,
  Rocket,
  Users,
  Building2,
  Code2,
  Megaphone,
  Newspaper,
  Server,
  Network,
  AlertTriangle,
  MessageSquare,
  Mail,
  Handshake,
  BookOpen,
} from "lucide-react";

/**
 * String → lucide component map. Lets Server Components pass a serializable
 * icon NAME to Client Components (which cannot receive component functions as
 * props across the RSC boundary).
 */
export const ICON_MAP = {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Ban,
  MailCheck,
  ScanText,
  Wand2,
  AtSign,
  PenLine,
  Wrench,
  TrendingUp,
  Gauge,
  Inbox,
  Rocket,
  Users,
  Building2,
  Code2,
  Megaphone,
  Newspaper,
  Server,
  Network,
  AlertTriangle,
  MessageSquare,
  Mail,
  Handshake,
  BookOpen,
};

export function resolveIcon(name) {
  return ICON_MAP[name] || null;
}
