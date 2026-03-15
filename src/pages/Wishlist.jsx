import React from "react";
import { useWishlistStore } from "../auth/wishlistStore";
import { useCartStore } from "../auth/cartStore";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  if (wishlist.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Your Wishlist is Empty ❤️</h3>
        <button
          className="btn btn-dark mt-3"
          onClick={() => navigate("/allproducts")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">My Wishlist</h2>

      <div className="row">
        {wishlist.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.title}
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.title}</h5>
                <p className="text-muted">₹ {item.price}</p>

                <div className="mt-auto">
                  <button
                    className="btn btn-dark w-100 mb-2"
                    onClick={() => {
                      addToCart(item);
                      toggleWishlist(item);
                    }}
                  >
                    Move to Cart
                  </button>

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => toggleWishlist(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Wishlist);
