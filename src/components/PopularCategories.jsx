import { useNavigate } from "react-router-dom";

function PopularCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Universal Box",
      query: "Universal Box",
      img: "/img/produt-1.webp",
    },
    { name: "Rigid Boxes", query: "Rigid Box", img: "/img/produt-2.webp" },
    { name: "Mailer Boxes", query: "Mailer Box", img: "/img/produt-3.webp" },
    {
      name: "Chocolate Boxes",
      query: "Chocolate Box",
      img: "/img/produt-5.webp",
    },
    { name: "Hamper Boxes", query: "Hamper Box", img: "/img/produt-4.webp" },
    { name: "Tuck Top Box", query: "Tuck Top Box", img: "/img/produt-9.webp" },
    { name: "Gift Boxes", query: "Gift Box", img: "/img/produt-10.webp" },
    { name: "Paper Boxes", query: "Paper Box", img: "/img/produt-7.webp" },
  ];

  const handleCategoryClick = (queryName) => {
    navigate(`/allproducts?category=${encodeURIComponent(queryName)}`);
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[2px] w-8 bg-yellow-500"></span>
              <span className="text-yellow-600 font-bold tracking-[0.2em] text-[10px] uppercase">
                Premium Collection
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.9] uppercase italic">
              Popular <br />{" "}
              <span className="text-gray-300 not-italic">Categories</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-[280px] font-medium leading-relaxed border-l-2 border-gray-100 pl-5">
            Crafting the standard in high-end packaging. Explore our most
            popular formats.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {categories.map((category) => (
            <div
              key={category.query}
              onClick={() => handleCategoryClick(category.query)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#f8f9fa] border border-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:border-gray-200">
                {/* Product Image */}
                <img
                  src={category.img}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle White Fade on Hover (Enhances button readability) */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Hover CTA Button (Inside the Image Card) */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]">
                  <div className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 hover:bg-yellow-400 hover:border-yellow-400 hover:text-white transition-colors">
                    Explore Now
                    <span className="text-yellow-500 text-base leading-none group-hover/btn:text-white transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Info (Cleanly centered below the box) */}
              <div className="mt-5 text-center px-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight transition-colors group-hover:text-yellow-600">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCategories;
