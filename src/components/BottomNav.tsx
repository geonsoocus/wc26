"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", label: "홈", icon: HomeIcon },
  { href: "/rental", label: "구장 예약", icon: RentalIcon },
  { href: "/", label: "플랩월드", icon: WorldIcon },
  { href: "/schedule", label: "일정", icon: ScheduleIcon },
  { href: "/my", label: "MY", icon: MyIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  const isHidden = pathname.startsWith("/profile/create") || pathname.startsWith("/match") || pathname.startsWith("/locker") || pathname.startsWith("/about");
  if (isHidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-[25px] lg:hidden">
      <div className="mx-auto flex items-start justify-between pt-1.5 pb-5 px-1">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] ${
                isActive ? "text-[#22252a] font-bold" : "text-[#9da2af] font-medium"
              }`}
            >
              <item.icon active={isActive} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill={active ? "#22252a" : "none"} stroke={active ? "none" : "#9da2af"} strokeWidth="1.8">
      <path d="M14 4L4 12v11a1 1 0 001 1h6v-7h6v7h6a1 1 0 001-1V12L14 4z" />
    </svg>
  );
}

function RentalIcon({ active }: { active: boolean }) {
  const color = active ? "#22252a" : "#9da2af";
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="8" width="18" height="14" rx="2" />
      <path d="M9 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />
      <line x1="14" y1="13" x2="14" y2="16" />
      <circle cx="14" cy="13" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function WorldIcon({ active }: { active: boolean }) {
  const color = active ? "#22252a" : "#9da2af";
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="10" />
      <ellipse cx="14" cy="14" rx="4" ry="10" />
      <line x1="4" y1="14" x2="24" y2="14" />
      <path d="M6 8h16" />
      <path d="M6 20h16" />
    </svg>
  );
}

function ScheduleIcon({ active }: { active: boolean }) {
  const color = active ? "#22252a" : "#9da2af";
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="20" height="18" rx="2" />
      <line x1="4" y1="12" x2="24" y2="12" />
      <line x1="10" y1="4" x2="10" y2="8" />
      <line x1="18" y1="4" x2="18" y2="8" />
      <rect x="8" y="15" width="3" height="3" rx="0.5" fill={color} stroke="none" />
      <rect x="12.5" y="15" width="3" height="3" rx="0.5" fill={color} stroke="none" />
      <rect x="17" y="15" width="3" height="3" rx="0.5" fill={color} stroke="none" />
    </svg>
  );
}

function MyIcon({ active }: { active: boolean }) {
  const color = active ? "#22252a" : "#9da2af";
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 23v-2a4 4 0 00-4-4h-8a4 4 0 00-4 4v2" />
      <circle cx="14" cy="9" r="4" />
    </svg>
  );
}
