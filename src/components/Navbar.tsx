"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { Settings } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        // event.target is EventTarget which may not be a Node, so cast to Node for contains()
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };
  const pathname = usePathname();
  if(pathname.includes("dashboard")){
    return null;
  }
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-700/65 backdrop-blur-md py-3.5 px-6">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
  <div className='flex items-center gap-3 group'>      
<div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20 border border-outline-variant/20 dark:border-white/10">
           <Image
            src="/logo.jpg"
            alt="E-Commerce Logo"
            fill
            className="object-cover"
            priority
            unoptimized
          />        
        </div>
<span className="block text-base sm:text-lg md:text-2xl font-black tracking-tight text-on-background transition-colors">
          E-<span className="text-cyan-500 -ml-[0.15em]">Commerce</span>
        </span>
        </div>  

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-8">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors ${
          pathname === "/"
            ? "text-cyan-500 font-semibold"
            : "text-slate-300 hover:text-white"
        }`}>
        Home
      </Link>

      <Link
        href="/products"
        className={`text-sm font-medium transition-colors ${
          pathname.startsWith("/products")
            ? "text-cyan-500 font-semibold"
            : "text-slate-300 hover:text-white"
        }`}>
        Products
      </Link>
      <Link
        href="/my-bookings"
        className={`text-sm font-medium transition-colors ${
          pathname.startsWith("/my-bookings")
            ? "text-cyan-500 font-semibold"
            : "text-slate-300 hover:text-white"
        }`}>
        My Bookings
      </Link>

      {session && (
        <Link
          href="/addproduct"
          className={`text-sm font-medium transition-colors ${
            pathname.startsWith("/addproduct")
              ? "text-cyan-500 font-semibold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Add Product
        </Link>
      )}
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-3">

      {/* Avatar Outside Menu */}
      {session?.user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center cursor-pointer"
          >
            <Image
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover border border-cyan-500"
              src={session.user.image || "/default-avatar.png"}
              alt="avatar"
            />
          </button>

          {dropdownOpen && (
<div className="absolute right-0 mt-3 w-56 bg-slate-700 border border-white/10 rounded-2xl shadow-xl py-2">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-cyan-500 text-xs font-bold">
                  {((session.user as { role?: string })?.role ?? "User") + " Account"}
                </p>
                <p className="text-white font-semibold">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {session.user.email}
                </p>
              </div>
<Link href={"/profile"}
      className="w-full flex items-center gap-2 px-4 py-2 text-cyan-400 hover:bg-cyan-500/10">
        <Settings className="w-5 h-5" />
                Profile
              </Link>              
<button onClick={handleLogout}
      className="w-full flex items-center gap-2 px-4 py-2 text-cyan-400 hover:bg-cyan-500/10">
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white text-xl"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Login/Register Desktop */}
      {!session && (
        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin">
            <button className="text-slate-300 hover:text-white">
              Login
            </button>
          </Link>

          <Link
            href="/signup"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl"
          >
            SignUp
          </Link>
        </div>
      )}
    </div>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden mt-4 border-t border-white/10 pt-4">
      <div className="flex flex-col gap-4">

        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="text-slate-300"
        >
          Home
        </Link>

        <Link
          href="/products"
          onClick={() => setMenuOpen(false)}
          className="text-slate-300"
        >
          Products
        </Link>
        <Link
          href="/my-bookings"
          onClick={() => setMenuOpen(false)}
          className="text-slate-300"
        >
          My Bookings
        </Link>

        {session && (
          <Link
            href="/addproduct"
            onClick={() => setMenuOpen(false)}
            className="text-slate-300"
          >
            Add Product
          </Link>
        )}

        {!session && (
          <>
            <Link
              href="/signin"
              onClick={() => setMenuOpen(false)}
              className="text-slate-300"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center py-2 rounded-xl">
              SignUp
            </Link>
          </>
        )}
      </div>
    </div>
  )}
</nav>
  );
}