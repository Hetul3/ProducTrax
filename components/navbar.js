import React from 'react';
import Link from 'next/link';
import {signIn, signOut} from 'next-auth/react'

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className="nav-item">
          <Link href="/">
            <span className="nav-link">Home</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/dashboard">
            <span className="nav-link">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/blog">
            <span className="nav-link">Blog</span>
          </Link>
        </li>

        {/* Put in the path to the catch all routes */}
        <li className="nav-item">
          <Link href="/api/auth/signin">
            <span className="nav-link" onClick={e => {
                e.preventDefault()
                signIn()
            }}>Sign in</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/api/auth/signout">
            <span className="nav-link" onClick={e => {
                e.preventDefault()
                signOut()
            }}>Sign out</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
