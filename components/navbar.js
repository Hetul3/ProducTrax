import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { date: session, status } = useSession();

  //send user back to the index page after signing out
  const handleSignOut = async () => {
    await signOut(); 
    window.location.replace("/");
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {/* Put in the path to the catch all routes */}

        {status != "authenticated" && (
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

        {status === "authenticated" && (
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
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
