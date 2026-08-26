import type { LucideIcon, LucideProps } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  Building2,
  Calculator,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ClipboardCheck,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Folder,
  GitBranch,
  HardHat,
  Heart,
  History,
  Home,
  Inbox,
  Layers,
  LayoutDashboard,
  Leaf,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Minus,
  Monitor,
  Moon,
  Package,
  Plus,
  PlusCircle,
  Route,
  Scale,
  ScanLine,
  Search,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Star,
  Sun,
  Target,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";

export type IconName =
  | "layout-dashboard"
  | "folder"
  | "plus-circle"
  | "history"
  | "file-text"
  | "book-open"
  | "settings"
  | "user"
  | "log-out"
  | "menu"
  | "x"
  | "mail"
  | "lock"
  | "upload"
  | "scan"
  | "calculator"
  | "shield"
  | "check"
  | "arrow-right"
  | "building"
  | "hard-hat"
  | "microscope"
  | "layers"
  | "git-branch"
  | "bell"
  | "sun"
  | "moon"
  | "monitor"
  | "target"
  | "clipboard-check"
  | "scale"
  | "users"
  | "map-pin"
  | "leaf"
  | "sparkles"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "calendar"
  | "eye"
  | "eye-off"
  | "home"
  | "plus"
  | "minus"
  | "route"
  | "search"
  | "inbox"
  | "clock"
  | "alert-triangle"
  | "package"
  | "clipboard"
  | "star"
  | "heart"
  | "share";

const ICONS: Record<IconName, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  folder: Folder,
  "plus-circle": PlusCircle,
  history: History,
  "file-text": FileText,
  "book-open": BookOpen,
  settings: Settings,
  user: User,
  "log-out": LogOut,
  menu: Menu,
  x: X,
  mail: Mail,
  lock: Lock,
  upload: Upload,
  scan: ScanLine,
  calculator: Calculator,
  shield: Shield,
  check: Check,
  "arrow-right": ArrowRight,
  building: Building2,
  "hard-hat": HardHat,
  microscope: Microscope,
  layers: Layers,
  "git-branch": GitBranch,
  bell: Bell,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  target: Target,
  "clipboard-check": ClipboardCheck,
  scale: Scale,
  users: Users,
  "map-pin": MapPin,
  leaf: Leaf,
  sparkles: Sparkles,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  calendar: Calendar,
  eye: Eye,
  "eye-off": EyeOff,
  home: Home,
  plus: Plus,
  minus: Minus,
  route: Route,
  search: Search,
  inbox: Inbox,
  clock: Clock,
  "alert-triangle": AlertTriangle,
  package: Package,
  clipboard: Clipboard,
  star: Star,
  heart: Heart,
  share: Share2,
};

type IconProps = LucideProps & {
  name: IconName;
  size?: number;
  filled?: boolean;
};

export function Icon({ name, size = 20, filled, className, strokeWidth = 1.75, ...props }: IconProps) {
  const Cmp = ICONS[name];
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      fill={filled ? "currentColor" : "none"}
      aria-hidden={props["aria-hidden"] ?? true}
      {...props}
    />
  );
}

export function NavIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <Icon name={name} size={size} />;
}
