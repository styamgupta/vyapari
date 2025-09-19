"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "📋 Home" },
    { href: "/dashboard", label: "📊 Dashboard" },
    { href: "/updateProduct", label: "📦 Products" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-2 md:p-6 md:max-w-md md:mx-auto md:space-y-6">
      <div className="flex justify-around md:grid md:grid-cols-4 md:gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group block rounded-xl p-2 text-center font-semibold text-blue-600 hover:bg-blue-50 relative"
          >
            {/* Mobile icon */}
            <span className="md:hidden">{link.label.split(" ")[0]}</span>

            {/* Tooltip for mobile */}
            <span className="md:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1 px-2 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {link.label.split(" ")[1]}
            </span>

            {/* Desktop text */}
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        ))}

        {/* ⚙ Settings */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="block rounded-xl p-2 text-center font-semibold text-blue-600 hover:bg-blue-50 w-full"
          >
            <span className="md:hidden">⚙</span>
            <span className="hidden md:inline">⚙ Settings</span>
          </button>

          {open && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white border shadow-md rounded-lg overflow-hidden">
              <Link
                href="/login"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                🔑 Login
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                📝 Signup
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={async() => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login";
                  setOpen(false);
                  // call logout
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
