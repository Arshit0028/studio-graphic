import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PopularCategories = lazy(() => import("../components/PopularCategories"));
const CustomPackagingSection = lazy(
  () => import("../components/CustomPackagingSection"),
);
const TopSellingProducts = lazy(
  () => import("../components/TopSellingProducts"),
);
const WhyChooseUs = lazy(() => import("../components/WhyChooseUs"));
const Footer = lazy(() => import("../components/Footer"));

const slides = [
  {
    id: 1,
    img: "/img/10.webp",
    title: "Because first impressions matter",
    text: "India's Biggest Online Hub for Packaging Materials - Trusted by Businesses Across the Country",
  },
  {
    id: 2,
    img: "/img/13.webp",
    title: "We pack your vision",
    text: "From concept to carton, turning ideas into packages that tell your story",
  },
  {
    id: 3,
    img: "/img/12.webp",
    title: "Packaging that protects, branding that shines",
    text: "Smart packaging, built for flexibility and you can design them also",
  },
];

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
};

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center"
            >
              <div className="flex flex-col justify-center text-left mt-6 lg:mt-0">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-yellow-500 mb-5">
                  Premium Packaging
                </span>
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-wide leading-tight mb-6"
                  style={{ fontFamily: '"boldonse", sans-serif' }}
                >
                  {slides[activeIndex].title}
                </h1>
                <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg mt-1">
                  {slides[activeIndex].text}
                </p>
              </div>

              <div
                className="relative w-full rounded-2xl overflow-hidden bg-gray-50 shadow-sm"
                style={{ height: "clamp(240px, 60vw, 520px)" }}
              >
                <img
                  src={slides[activeIndex].img}
                  alt={slides[activeIndex].title}
                  className="w-full h-full object-cover"
                  fetchPriority={activeIndex === 0 ? "high" : "low"}
                  loading={activeIndex === 0 ? "eager" : "lazy"}
                  width="660"
                  height="520"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-5 mt-8">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500 hover:shadow-md transition-all duration-200"
            aria-label="Previous"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-gray-800 w-6" : "bg-gray-200 w-2 hover:bg-gray-400"}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-400 hover:border-yellow-400 hover:text-yellow-500 hover:shadow-md transition-all duration-200"
            aria-label="Next"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="bg-white">
      <HeroCarousel />
      <Suspense
        fallback={
          <div className="py-20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
          </div>
        }
      >
        <PopularCategories />
        <CustomPackagingSection />
        <TopSellingProducts />
        <WhyChooseUs />
        <Footer />
      </Suspense>
    </main>
  );
}
