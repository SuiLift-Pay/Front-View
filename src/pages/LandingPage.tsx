import { useRef, useState } from "react";
import {
  FaWallet,
  FaExchangeAlt,
  FaRegCreditCard,
  FaBolt,
  FaShieldAlt,
  FaPlay,
} from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineCreditCard } from "react-icons/hi";
import { GiPayMoney } from "react-icons/gi";
import { FaGoogle } from "react-icons/fa";
import { SiSui } from "react-icons/si";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaSuitcase } from "react-icons/fa6";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const featureCards = [
  {
    icon: <FaWallet className="text-blue-500 w-12 h-12" />,
    title: "Choose Your Funding Style",
    desc: "Keep SUI or tokens on-chain for maximum control, or convert to fiat SUI, or tokens spending with NFTs.",
  },
  {
    icon: <FaBolt className="text-yellow-500 w-12 h-12" />,
    title: "Lightning-Fast Transactions",
    desc: "Powered by Sui's high-speed blockchain, enjoy near-instant conversions and low fees.",
  },
  {
    icon: <FaShieldAlt className="text-blue-500 w-12 h-12" />,
    title: "Full Control, Zero Compromise",
    desc: "Your funds stay in your non-custodial wallet, secured by Sui's cutting-edge technology.",
  },
  {
    icon: <FaBolt className="text-yellow-500 w-12 h-12" />,
    title: "Effortless Spending",
    desc: "Powered by Sui's high-speed blockchain, enjoy near-instant conversions and low fees.",
  },
];

const features = [
  {
    title: "Flexible Funding Option",
    desc: "Fund your card with SUI or tokens and keep them On-chain until you spend, or convert to Fiat for instant payments.",
    icon: <FaWallet className="text-blue-500 w-8 h-8 mb-3" />,
    border: "border-blue-500 bg-blue-500/10",
  },
  {
    title: "Instant Conversion",
    desc: "Convert your crypto to fiat instantly at the point of sale for seamless transactions.",
    icon: <FaExchangeAlt className="text-green-500 w-8 h-8 mb-3" />,
    border: "border-green-500 bg-green-500/10",
  },
];

const LandingPage = () => {
  const refNavbar = useRef(null);
  const refHero = useRef(null);
  const refWhy = useRef(null);
  const refSteps = useRef(null);
  const refStep1 = useRef(null);
  const refStep2 = useRef(null);
  const refStep3 = useRef(null);
  const refFeatures = useRef(null);
  const refHeading = useRef(null);
  const refFooter = useRef(null);

  const isInViewNavbar = useInView(refNavbar, { once: false });
  const isInViewHero = useInView(refHero, { once: false });
  const isInViewWhy = useInView(refWhy, { once: false });
  const isInViewSteps = useInView(refSteps, { once: false });
  const isInViewStep1 = useInView(refStep1, { once: false });
  const isInViewStep2 = useInView(refStep2, { once: false });
  const isInViewStep3 = useInView(refStep3, { once: false });
  const isInViewFeatures = useInView(refFeatures, { once: false });
  const isInViewHeading = useInView(refHeading, { once: false });
  const isInViewFooter = useInView(refFooter, { once: false });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="">
      <section
        ref={refNavbar}
        className=""
        style={{
          backgroundImage: `url('/images/Browse.svg')`,
          backgroundSize: "620px 620px",
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Navbar */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={
            isInViewNavbar ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }
          }
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center md:px-30 lg:px-50 py-6 px-4 relative"
        >
          <img
            src="/images/logo.svg"
            alt="SuiLift Logo"
            className="lg:w-50 lg:h-30 md:w-20 w-20"
          />
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none z-30"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span
              className={`block w-6 h-0.5 bg-blue-500 mb-1 transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-blue-500 mb-1 transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-blue-500 transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
          {/* Desktop Nav */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={isInViewNavbar ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-blue-00 rounded-full p-3 items-center md:space-x-7 lg:space-x-16 md:text-xl lg:text-2xl hidden md:flex"
          >
            <a
              href="#home"
              className="hover:text-blue-500 md:text-sm lg:text-lg"
            >
              Home
            </a>
            <a
              href="#home"
              className="hover:text-blue-500 md:text-sm lg:text-lg"
            >
              About
            </a>
            <a
              href="#features"
              className="hover:text-blue-500 md:text-sm lg:text-lg"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-blue-500 md:text-sm lg:text-lg"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="hover:text-blue-500 md:text-sm lg:text-lg"
            >
              FAQ
            </a>
          </motion.nav>
          <main className="items-center space-x-2 bg-no-repeat bg-right hidden md:flex">
            <Link
              to="/signin"
              className="border hover:bg-blue-700 px-6 py-2 rounded-full font-semibold"
            >
              Launch Now
            </Link>
          </main>
          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-20 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <nav
                className="flex flex-col gap-8 text-2xl text-white items-center"
                aria-label="Mobile navigation menu"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href="#home"
                  className="hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#home"
                  className="hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#features"
                  className="hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it works
                </a>
                <a
                  href="#faq"
                  className="hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                <Link
                  to="/signin"
                  className="border hover:bg-blue-700 px-6 py-2 rounded-full font-semibold text-white text-lg mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Launch Now
                </Link>
              </nav>
            </motion.div>
          )}
        </motion.header>
      </section>

      {/* Hero Section */}
      <motion.section
        ref={refHero}
        initial={{ opacity: 0, y: 50 }}
        animate={isInViewHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `url('/images/Group 8.svg')`,
          backgroundSize: "",
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat cover",
        }}
        className="relative flex flex-col items-center text-center py-20 px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInViewHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-7xl font-extrabold mb-4 md:px-10 lg:px-85"
        >
          Spend Your Crypto <span className="text-indigo-400">Anywhere</span>{" "}
          with SuiLift
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInViewHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-md sm:text-lg text-gray-300 mb-6"
        >
          Powering the Future, One Lift at a Time
        </motion.p>
        <span className="mb-4 flex items-center gap-2">
          <img
            src="/images/sui.svg"
            alt="SuiLift Cube"
            className="w-5 md:w-5"
          />
          <span className="text-green-400 font-bold">Powered By SUI</span>
        </span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInViewHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center gap-4 mb-10"
        >
          <Link
            to="/signin"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold"
          >
            Launch App
          </Link>
          <Link
            to="/signin"
            className="border hover:bg-blue-700 px-6 py-2 rounded-full font-semibold"
          >
            Search
          </Link>
        </motion.div>
      </motion.section>
      <section
        id="about"
        className="mt-4 px-4 py-4 md:-mt-20  grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        <div className="px-0 md:px-10 md:z-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-blue-400">
            About <span className="text-white">SuiLift</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed">
            Built for the next era of finance, our platform lets you spend SUI
            tokens effortlessly through a virtual card accepted worldwide. With
            real-time conversion and secure on-chain storage, we connect the
            power of Web3 with the convenience of everyday payments.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            src="/images/suilift logo.svg"
            alt="SuiLift Cube"
            className="w-32 md:w-56 md:z-20"
          />
        </div>
      </section>
      {/* Why SuiLift Section */}
      <section
        ref={refWhy}
        id="why"
        className="px-4 md:px-10 lg:px-60 py-8 md:py-16 text-center"
      >
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2">
          Why <span className="text-blue-400">SuiLift</span>
        </h2>
        <p className="text-gray-400 mb-10 text-base md:text-lg">
          Unlock the future of payments with unmatched flexibility and control
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={
                isInViewWhy ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
              }
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className={`border ${f.border} p-6 rounded-xl text-left flex flex-col items-start`}
            >
              {f.icon}
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3 items-center text-center px-4 md:px-10 lg:px-60">
        <h1 className="text-xl md:text-3xl">
          Pay With Crypto in three simple steps
        </h1>
        <h1 className="text-base md:text-xl">
          From Funding to spending, SuiLift Makes Web3 payment effortless
        </h1>
      </section>
      {/* Step Numbers */}
      <motion.div
        ref={refSteps}
        initial={{ opacity: 0 }}
        animate={isInViewSteps ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10 flex justify-center items-center w-full max-w-3xl mx-auto text-xs md:text-sm font-bold mb-10 px-2"
      >
        <div className="flex items-center w-full">
          <h2 className="bg-blue-500 rounded-full p-2 md:p-3 flex-shrink-0">
            01
          </h2>
          <div className="flex-grow flex items-center mx-1 md:mx-2">
            <hr className="flex-grow h-px bg-gray-100 border-0" />
            <hr className="flex-grow h-px bg-gray-100 border-0" />
          </div>
          <h2 className="bg-blue-500 rounded-full p-2 md:p-3 flex-shrink-0">
            02
          </h2>
          <div className="flex-grow flex items-center mx-1 md:mx-2">
            <hr className="flex-grow h-px bg-gray-100 border-0" />
            <hr className="flex-grow h-px bg-gray-100 border-0" />
          </div>
          <h2 className="bg-blue-500 rounded-full p-2 md:p-3 flex-shrink-0">
            03
          </h2>
        </div>
      </motion.div>
      <div className="px-4 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
        {/* Step 1 */}
        <motion.div
          ref={refStep1}
          initial={{ opacity: 0, x: -50 }}
          animate={
            isInViewStep1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
          }
          transition={{ duration: 0.5 }}
          className="border rounded-lg p-6"
        >
          <div className="text-center mb-4">
            <FaUserCircle className="text-blue-500 w-12 h-12 mx-auto" />
          </div>
          <h3 className="font-semibold mb-4 text-center">
            Sign Up & Connect Your Wallet
          </h3>
          <p className="text-gray-400 text-sm mb-4 text-center">
            Create an account, complete quick KYC, and set up a non-custodial
            wallet with zkLogin for a seamless secure experience.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white w-full py-4 rounded-full text-sm flex items-center justify-center">
            <FaGoogle className="w-5 h-5 mr-2" />
            Google mobile login
          </button>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          ref={refStep2}
          initial={{ opacity: 0, x: 50 }}
          animate={isInViewStep2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="border rounded-lg p-6"
        >
          <div className="text-center mb-4">
            <HiOutlineCreditCard className="text-green-500 w-12 h-12 mx-auto" />
          </div>
          <h3 className="font-semibold mb-2">Fund your Card your way</h3>
          <p className="text-gray-400 text-sm mb-4">
            select funding options:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Crypto On-Chain: Load SUI or token, kept secure on Sui until you
                spend.
              </li>
              <li>
                Fiat Funding: Convert SUI, token, or NFTs (via BlueMove) to fiat
                for instant use
              </li>
            </ul>
          </p>
          <div className="flex gap-3 mt-4">
            <button className="bg-blue-500 hover:bg-blue-600 w-full p-1 rounded-full text-sm flex items-center justify-center">
              <SiSui className="w-5 h-5 mr-2" />
              SUI/Tokens
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-full text-sm flex items-center justify-center">
              <BsCurrencyDollar className="w-5 h-5 mr-1" />
              Fiat Convert
            </button>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          ref={refStep3}
          initial={{ opacity: 0, x: -50 }}
          animate={
            isInViewStep3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
          }
          transition={{ delay: 0.4, duration: 0.5 }}
          className="border rounded-lg p-6"
        >
          <div className="text-center mb-4">
            <GiPayMoney className="text-purple-500 w-12 h-12 mx-auto" />
          </div>
          <h3 className="font-semibold mb-5">Spend anywhere, anytime</h3>
          <p className="text-gray-400 text-sm text-center mt-2">
            - Pay online, in-store, for subscriptions. Approve transactions via
            our mobile app or automate recurring payment with smart contract
          </p>
          <div className="flex gap-5 justify-center mt-5">
            <FaSuitcase className="w-10 h-10 bg-blue-500 p-2 rounded-md" />
            <HiOutlineCreditCard className="w-10 h-10 bg-blue-500 p-2 rounded-md" />
          </div>
        </motion.div>
      </div>
      {/* Token → Card → Fiat */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-10 md:my-16 text-xs md:text-sm text-white flex-wrap px-4">
        <div className="flex items-center gap-2">
          <img
            src="/images/sui.svg"
            alt="SuiLift Cube"
            className="w-5 md:w-5"
          />
          <span>SUI Tokens</span>
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-2">
          <FaRegCreditCard className="w-6 h-6 text-blue-400" />
          <span>Virtual Card</span>
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-2">
          <div className="bg-green-500 px-2 py-1 rounded-full text-xs font-semibold">
            $
          </div>
          <span>Fiat Payment</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col md:flex-col  items-center gap-4 flex-wrap mb-4 px-4">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold w-full sm:w-auto"
          >
            Fund Your Card Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="flex flex-row items-center justify-center gap-3 border border-white px-6 py-2 rounded-md font-semibold w-full sm:w-auto"
          >
            <FaPlay
              className="inline-block text-blue-400"
              aria-label="Play video"
            />
            Watch a Demo
          </motion.button>
        </div>
        {/* Video Link */}
        <a
          href="#"
          className="text-blue-400 text-sm underline mt-2 md:mt-0 flex items-center gap-2"
        >
          60 Seconds explainer video
        </a>
      </div>
      {/* last card */}
      <div
        ref={refFeatures}
        className="flex flex-col items-center justify-center p-4 md:p-6"
      >
        <div className="text-center mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInViewFeatures ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-4xl font-bold text-blue-400"
          >
            The Ultimate Crypto Payment Solution
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInViewFeatures ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-400 mt-2 text-base md:text-lg"
          >
            Combine the power of Web3 with the ease of traditional payments.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          animate={isInViewFeatures ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
        >
          {featureCards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-gray-900 rounded-lg p-6 text-center"
            >
              <div className="flex justify-center mb-4">{card.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Heading and Logo */}
      <motion.div
        ref={refHeading}
        initial={{ opacity: 0, y: 50 }}
        animate={isInViewHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="text-center my-10 px-4"
      >
        <h2 className="text-2xl md:text-4xl font-bold">
          Powering the <span className="text-blue-500">Future</span> of Payments
        </h2>
      </motion.div>

      <section
        ref={refFooter}
        style={{
          backgroundImage: `url('/images/Group 10.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="flex flex-col items-center justify-center py-8 px-4 md:px-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={
            isInViewFooter ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
          }
          transition={{ duration: 0.5 }}
          className="mt-2 flex justify-start w-full lg:ml-40 md:ml-10"
        >
          <img
            src="/images/logo.svg"
            alt="SuiLift Logo"
            className="h-12 md:h-16"
          />
        </motion.div>
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 p-4 md:p-6 max-w-7xl w-full text-center place-items-center">
          <div className="flex flex-col items-start">
            <h4 className="font-semibold text-md md:text-xl lg:text-2xl">
              Products
            </h4>
            <ul className="flex flex-col items-start mt-2 space-y-1 text-sm md:text-lg lg:text-xl">
              <li>Features</li>
              <li>How it Works</li>
              <li>Funding Options</li>
              <li>App Download</li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="font-semibold text-md md:text-xl lg:text-2xl">
              Company
            </h4>
            <ul className="flex flex-col items-start mt-2 space-y-1 text-sm md:text-lg lg:text-xl">
              <li>About Us</li>
              <li>Blog</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="font-semibold text-md md:text-xl lg:text-2xl">
              Support
            </h4>
            <ul className="flex flex-col items-start mt-2 space-y-1 text-sm md:text-lg lg:text-xl">
              <li>FAQ</li>
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="font-semibold text-md md:text-xl lg:text-2xl">
              Social
            </h4>
            <ul className="flex flex-col items-start mt-2 space-y-1 text-sm md:text-lg lg:text-xl">
              <li>Twitter</li>
              <li>Discord</li>
              <li>Telegram</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div className="text-center text-xs md:text-sm py-4 px-2">
        <p>Copyright © 2025 [SuiLift]. All rights reserved.</p>
      </div>
    </main>
  );
};

export default LandingPage;
