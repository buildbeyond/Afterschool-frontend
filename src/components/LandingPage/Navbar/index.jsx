import logo from "../../assets/images/logo/logo.svg";
import logoWhite from "../../assets/images/logo/logo-white.svg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import ClickOutside from "../ClickOutside.jsx";
import { useEffect, useState } from "react";

const navList = [
  // {
  //   link: "/",
  //   text: "Home",
  // },
  // {
  //   link: "#",
  //   text: "Payment",
  // },
  // {
  //   link: "#",
  //   text: "Features",
  // },
];

const Navbar = ({ navbarOpen, setNavbarOpen }) => {
  const handleNavbarToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  return (
    <header
      className={`sticky left-0 top-0 z-50 w-full bg-white dark:bg-dark ${
        sticky && "bg-opacity-80 shadow-sm backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link to="/" className="block w-full py-5">
              <img src={logo} alt="logo" className="w-full dark:hidden" />
              <img
                src={logoWhite}
                alt="logo"
                className="hidden w-full dark:block"
              />
            </Link>
          </div>

          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={handleNavbarToggle}
                className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
              </button>

              <ClickOutside onClick={() => setNavbarOpen(false)}>
                <nav
                  className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow transition-all dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${navbarOpen ? "" : "hidden"}`}
                >
                  <ul className="block lg:flex">
                    {navList.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.link}
                          className="flex py-2 text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary lg:ml-12 lg:inline-flex"
                        >
                          {item.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </ClickOutside>
            </div>

            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <Link
                to="/auth/signin"
                className="px-7 py-3 text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="rounded-lg bg-primary px-7 py-3 text-base font-medium text-white hover:bg-opacity-90"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  navbarOpen: PropTypes.bool.isRequired,
  setNavbarOpen: PropTypes.func.isRequired,
};

export default Navbar;
