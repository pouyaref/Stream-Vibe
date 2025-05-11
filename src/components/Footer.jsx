import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">StreamVibe</h3>
            <p className="mb-4">
              The ultimate streaming experience with no ads and 4K quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-red-500 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-red-500 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-red-500 transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-red-500 transition">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Movies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  TV Shows
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  New Releases
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  DMCA
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Help Center
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  System Requirements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>© {new Date().getFullYear()} StreamVibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
