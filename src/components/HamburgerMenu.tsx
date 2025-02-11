"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const menuItems = [
  { name: "Vocabulary", href: "/vocab" },
  { name: "Courses", href: "/courses" }
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch("/api/supabase_goldlist_count");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: { count: number } = await response.json();
        setCount(data.count);
      } catch (err) {
        console.log(err)
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCount();
  }, []);

  return (
    <div className="relative">
      {count !== null && count > 0 && (
        <Button
          variant="outline"
          className="absolute z-50 -right-2 -top-2 h-6 px-2 font-bold border border-red-400 hover:text-red-400 hover:bg-white text-sm bg-red-400 text-white hover rounded-full"
        >
          {isLoading ? <></> : error ? <>{error}</> : <>{count}</>}
        </Button>
      )}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              {item.name}
              {item.name === "Vocabulary" && count !== null &&
                count > 0 &&
                (isLoading ? <></> : error ? <>{error}</> : <> ({count})</>)}
            </Link>
          ))}
          <LogoutLink className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Logout
          </LogoutLink>
        </div>
      )}
    </div>
  );
}
