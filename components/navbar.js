import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { CgTimer } from "react-icons/cg";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const handleSignOut = async () => {
    await signOut();
    window.location.replace("index.js");
  };

  const handleProfileClick = () => {
    setShowTooltip(!showTooltip);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {status !== "authenticated" && (
          <div className="sign-in-container">
            <Link href="/api/auth/signin">
              <li className="nav-item">
                <span
                  className="nav-link-si"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  Sign in
                </span>
              </li>
            </Link>
          </div>
        )}

        {status === "authenticated" && session && session.user && (
          <>
            <div className="whole-nav-container">
              <li className="nav-item">
                <div className="nav-item-container">
                  <Link href="/comments">
                    <span className="nav-link">
                      <AiOutlineUnorderedList className="list-icon" />
                    </span>
                  </Link>
                </div>
                <div className="nav-item-container">
                  <Link href="/timer">
                    <span className="nav-link">
                      <CgTimer className="list-icon" />
                    </span>
                  </Link>
                </div>
              </li>
            </div>
            <li className="nav-item-pic">
              <div className="profile-image-container">
                <div
                  className="profile-image"
                  onClick={handleProfileClick}
                  ref={tooltipRef}
                >
                  <Image
                    className="profile-image"
                    src={`/api/proxy-image?imageUrl=${encodeURIComponent(
                      session.user.image
                    )}`}
                    width={40}
                    height={40}
                    alt="profile-pic"
                  />
                </div>
                <div className={`tooltip ${showTooltip ? "show" : ""}`}>
                  <div className="pic-info-container">
                    <Image
                      className="large-profile-pic"
                      src={`/api/proxy-image?imageUrl=${encodeURIComponent(
                        session.user.image
                      )}`}
                      width={100}
                      height={100}
                      alt="large-profile-pic"
                    />
                    <div className="info-container">
                      <h3 className="user-name">{session.user.name}</h3>
                      <h4 className="user-email">{session.user.email}</h4>
                    </div>
                  </div>
                  <Link href="/api/auth/signout">
                    <div className="sign-out-container">
                      <span
                        className="tooltip-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          signOut();
                          handleSignOut();
                        }}
                      >
                        Sign out
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
