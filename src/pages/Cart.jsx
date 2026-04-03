import React, { useMemo } from "react";
import { useCartStore } from "../auth/cartStore";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Your Cart is Empty 🛒</h3>
        <button
          className="btn btn-dark mt-3"
          onClick={() => navigate("/allproducts")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>

      <div className="row">
        <div className="col-lg-8">
          {cart.map((item) => (
            <div key={item.id} className="card mb-3 shadow-sm border-0">
              <div className="row g-0 align-items-center p-3">
                <div className="col-md-3 text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: "120px", objectFit: "cover" }}
                  />
                </div>

                <div className="col-md-5">
                  <h5 className="fw-semibold">{item.title}</h5>
                  <p className="text-muted mb-1">₹ {item.price}</p>
                </div>

                <div className="col-md-2 text-center">
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => decrementQuantity(item.id)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => incrementQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-md-2 text-end">
                  <p className="fw-bold mb-1">₹ {item.price * item.quantity}</p>
                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card shadow border-0 p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹ ${shipping}`}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>

            <button
              className="btn btn-dark w-100 mt-4"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <button
              className="btn btn-outline-danger w-100 mt-2"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Cart);
