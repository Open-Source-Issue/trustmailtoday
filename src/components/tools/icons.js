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
} from "lucide-react";

/** Maps the string `icon` field in lib/tools.js to a lucide component. */
export const TOOL_ICONS = {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Ban,
  MailCheck,
  ScanText,
  Wand2,
  AtSign,
  PenLine,
};

export function toolIcon(name) {
  return TOOL_ICONS[name] || Wrench;
}
