import Link from "next/link";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function Header({logoText} : {logoText: string}) {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl text-indigo-600 md:text-3xl font-bold mb-6">
            {logoText}
            </Link>
          </div>
            <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
