import { useState } from "react";
import UploadProductModal from "./UploadProductModal";

function CustomPackagingSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section
        id="customdesign"
        className="relative bg-[#f3f3f3] py-24 overflow-hidden scroll-mt-24"
      >
        {/* Background white circle */}
        <div className="absolute left-[-250px] top-[-120px] w-[650px] h-[650px] rounded-full bg-white"></div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-7">
              {/* Heading */}
              <div className="relative mb-10">
                <span className="absolute -left-6 top-2 w-20 h-20 bg-yellow-400 rounded-full -z-10"></span>

                <h2
                  className="text-[32px] md:text-[36px] lg:text-[40px] leading-[1.3] text-black whitespace-nowrap"
                  style={{ fontFamily: '"boldonse", sans-serif' }}
                >
                  Packaging Customized Exactly Your Way.
                </h2>
              </div>

              {/* Description */}
              <p className="max-w-xl text-[16px] leading-relaxed text-gray-700 mb-14">
                Design packaging exactly the way you want. Choose your logo,
                select the perfect size, and decide the quality that matches
                your brand standards. We help you create packaging that protects
                your product and represents your business with confidence.
              </p>

              {/* Steps */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-14">
                <div className="group text-center cursor-pointer transition-all duration-300">
                  <span className="block text-[70px] font-bold text-transparent stroke-gray group-hover:stroke-yellow-400 transition">
                    01
                  </span>
                  <p className="font-semibold text-gray-900 group-hover:text-yellow-400 transition">
                    Upload Your <br /> Product
                  </p>
                </div>

                <div className="group text-center cursor-pointer transition-all duration-300">
                  <span className="block text-[70px] font-bold text-transparent stroke-gray group-hover:stroke-yellow-400 transition">
                    02
                  </span>
                  <p className="font-semibold text-gray-900 group-hover:text-yellow-400 transition">
                    Select Packaging <br /> Suggest by AI
                  </p>
                </div>

                <div className="group text-center cursor-pointer transition-all duration-300">
                  <span className="block text-[70px] font-bold text-transparent stroke-gray group-hover:stroke-yellow-400 transition">
                    03
                  </span>
                  <p className="font-semibold text-gray-900 group-hover:text-yellow-400 transition">
                    Add Size, Logo <br /> and Tagline
                  </p>
                </div>

                <div className="group text-center cursor-pointer transition-all duration-300">
                  <span className="block text-[70px] font-bold text-transparent stroke-gray group-hover:stroke-yellow-400 transition">
                    04
                  </span>
                  <p className="font-semibold text-gray-900 group-hover:text-yellow-400 transition">
                    Buy your <br /> Packaging
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                className="bg-yellow-400 px-8 py-4 rounded-md font-semibold text-black hover:bg-yellow-500 transition"
                onClick={() => setShowModal(true)}
              >
                Upload Product
              </button>
            </div>

            {/* RIGHT IMAGE */}
            <div className="lg:col-span-5 text-center">
              <img
                src="/img/box-2.png"
                alt="Packaging"
                className="max-w-full mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <UploadProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Stroke styles */}
      <style jsx>{`
        .stroke-gray {
          -webkit-text-stroke: 1.5px #cfcfcf;
        }

        .stroke-yellow {
          -webkit-text-stroke: 1.5px #facc15;
        }
      `}</style>
    </>
  );
}

export default CustomPackagingSection;
