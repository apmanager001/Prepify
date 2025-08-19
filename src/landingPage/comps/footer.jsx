import { Instagram } from "lucide-react";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          {/* Company Info */}
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <div className="w-50 h-10 bg-white/40  rounded-lg flex items-center justify-center">
                <Image
                  src="/logoNoSlogan.webp"
                  alt="Prepify Logo"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Prepify is a student-led nonprofit initiative fiscally sponsored
              by the Institute for Education, Research, and Scholarships
              (IFERS), a registered 501(c)(3) organization. All donations to
              Prepify are processed through IFERS and are tax-deductible to the
              fullest extent allowed by law.
            </p>
            <p className="text-gray-300 mb-4 max-w-md">
              To learn more about our fiscal sponsor, please visit{" "}
              <a
                href="https://ifers.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ifers.org
              </a>
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/its_prepify/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="https://www.tiktok.com/@its_prepify?_t=ZT-8yxziYNg1Ve&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Tiktok"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="md:w-1/3 flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Quick Links */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#mission"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#getStarted"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Get Started
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#contact"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Sponsors */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Sponsors
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <a
                    href="https://ifers.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    IFERS
                  </a>
                  <Image
                    src="/ifers.png"
                    alt="IFERS Logo"
                    width={50}
                    height={50}
                  />
                </li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Prepify. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
