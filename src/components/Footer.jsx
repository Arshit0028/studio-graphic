import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white pb-12 pt-28 font-sans text-gray-600">
      {/* Premium Horizontal Watermark: Behind the text, shaded and faded */}
      <div className="pointer-events-none absolute left-0 top-12 z-0 flex w-full justify-center select-none overflow-hidden opacity-40">
        <div className="whitespace-nowrap text-[16vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-200 via-gray-100 to-transparent md:text-[14vw]">
          GET IN TOUCH
        </div>
      </div>

      {/* Main Content (Removed top margins so it overlays the watermark) */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-3 lg:gap-10">
          {/* Column 1: Brand */}
          <div className="lg:pr-12">
            <h6 className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-gray-900">
              Studio Graphics
            </h6>
            <p className="text-[0.95rem] leading-loose text-gray-500">
              Elevating packaging into an art form. We craft bespoke solutions
              that marry structural integrity with premium aesthetics, ensuring
              your brand makes an unforgettable first impression.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="md:justify-self-center">
            <h6 className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-gray-900">
              Explore
            </h6>
            <ul className="flex flex-col space-y-5">
              {["Home", "Our Story", "Portfolio", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="!cursor-pointer block !text-[0.95rem] !text-gray-500 !no-underline transition-all duration-300 hover:tracking-wide hover:!text-gray-900"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h6 className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-gray-900">
              Connect
            </h6>
            <div className="mb-8">
              <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gray-400">
                Address
              </span>
              <p className="text-[0.95rem] leading-relaxed text-gray-500">
                26 1st Floor, Paschim Vihar Extension, <br />
                New Delhi, 110063
              </p>
            </div>
            <div>
              <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gray-400">
                Phone
              </span>
              <a
                href="tel:+919560663132"
                className="mt-1 block !cursor-pointer !text-[0.95rem] !text-gray-500 !no-underline transition-colors duration-300 hover:!text-gray-900"
              >
                +91 95606 63132
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 mx-auto mt-24 max-w-[95%] border-t border-gray-200/60 pt-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Copyright */}
            <div className="text-center text-[0.85rem] tracking-wide text-gray-400 md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold text-gray-900">Graphics Studio</span>.
              All rights reserved.
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-8 md:pr-12">
              {[
                { icon: FaFacebook, label: "Facebook" },
                { icon: FaTwitter, label: "Twitter" },
                { icon: FaLinkedin, label: "LinkedIn" },
                { icon: FaInstagram, label: "Instagram" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className="block !cursor-pointer text-lg !text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:!text-gray-900"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
