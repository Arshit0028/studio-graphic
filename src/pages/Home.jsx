import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 1. LAZY LOAD COMPONENTS
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
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
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
    <section className="relative w-full overflow-hidden bg-white min-h-[85vh] lg:h-[650px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative h-[600px] lg:h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <div className="flex flex-col justify-center text-left">
                <h1
                  className="hero-title mb-6 text-4xl md:text-5xl text-gray-900 tracking-wide leading-tight"
                  style={{ fontFamily: '"boldonse", sans-serif' }}
                >
                  {slides[activeIndex].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                  {slides[activeIndex].text}
                </p>
              </div>

              <div className="relative w-full h-[350px] sm:h-[450px] lg:h-full overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={slides[activeIndex].img}
                  alt={slides[activeIndex].title}
                  className="w-full h-full object-cover shadow-sm"
                  fetchPriority={activeIndex === 0 ? "high" : "low"}
                  loading={activeIndex === 0 ? "eager" : "lazy"}
                  width="660"
                  height="600"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20">
          <button
            onClick={handlePrev}
            className="p-2 hover:scale-110 transition-transform"
            aria-label="Prev"
          >
            ‹
          </button>
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-gray-900 w-8" : "bg-gray-300 w-2"}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-2 hover:scale-110 transition-transform"
            aria-label="Next"
          >
            ›
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
      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <PopularCategories />
        <CustomPackagingSection />
        <TopSellingProducts />
        <WhyChooseUs />
        <Footer />
      </Suspense>
    </main>
  );
}
