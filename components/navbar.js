import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.replace("/");
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {status !== "authenticated" && (
          <li className="nav-item">
            <Link href="/api/auth/signin">
              <span
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </span>
            </Link>
          </li>
        )}

        {status === "authenticated" && session && session.user && (
          <>
            <li className="nav-item">
              <Link href="/api/auth/signout">
                <span
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                    handleSignOut();
                  }}
                >
                  Sign out
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/comments">
                <span className="nav-link">Your TODO List</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/comments">
                <span className="nav-link">{session.user.name}</span>
              </Link>
              <Image
              className="profile-image"
                  src={`/api/proxy-image?imageUrl=${encodeURIComponent(
                    session.user.image
                  )}`}
                  width={30}
                  height={30}
                  alt="profile-pic"
                />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
