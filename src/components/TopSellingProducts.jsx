import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Heart } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

function TopSellingProducts() {
  const products = [
    { id: 1, img: "/img/product/1.jpg" },
    { id: 2, img: "/img/product/2.jpg" },
    { id: 3, img: "/img/product/3.jpg" },
    { id: 4, img: "/img/product/4.jpg" },
    { id: 5, img: "/img/product/5.jpg" },
    { id: 6, img: "/img/product/6.jpg" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 mt-10 mb-10">
        {/* Heading Wrapper */}
        <div style={{ marginBottom: "45px" }}>
          <h2
            style={{
              fontFamily: '"boldonse", sans-serif',
              fontSize: "30px",
              color: "#000",
              fontWeight: "600",
            }}
          >
            Top Selling Product
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Left Arrow */}
          <button className="swiper-prev absolute left-[-18px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#f4a300] flex items-center justify-center shadow-md hover:scale-105 transition">
            ‹
          </button>

          {/* Right Arrow */}
          <button className="swiper-next absolute right-[-18px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#f4a300] flex items-center justify-center shadow-md hover:scale-105 transition">
            ›
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={28}
            navigation={{
              nextEl: ".swiper-next",
              prevEl: ".swiper-prev",
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={800}
            breakpoints={{
              320: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
              1200: { slidesPerView: 5 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                {/* Product Card */}
                <div className="bg-white border border-[#e5e5e5] rounded-md overflow-hidden hover:border-[#f4a300] hover:shadow-md transition-all duration-300">
                  {/* Product Image */}
                  <div className="relative bg-[#fafafa]">
                    <img
                      src={product.img}
                      alt="product"
                      className="w-full h-[220px] object-contain p-4 transition duration-300 hover:scale-[1.03]"
                    />

                    {/* Wishlist */}
                    <div className="absolute top-3 right-3 w-8 h-8 border border-[#dcdcdc] bg-white flex items-center justify-center rounded-sm cursor-pointer hover:text-red-500 transition">
                      <Heart size={16} />
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-4">
                    <p className="text-[16px] text-[#1c1c1c] mb-1 leading-snug">
                      Matchmaker Box Magnetic Rigid Hamper Box
                    </p>

                    <p className="text-[14px] text-gray-500 mb-2">
                      9×5×2 Inch - 300 GSM
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-[18px] font-semibold">
                        1000 Rs.
                      </span>

                      <del className="text-gray-400 text-[14px]">1500 Rs.</del>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TopSellingProducts;
