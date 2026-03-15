import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../auth/useAuthStore";
import api from "../api/axios";
import Footer from "../components/Footer";

function Orders() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/v1/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedOrders = response?.data?.data || response?.data || [];
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Order Fetch Error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load your orders. Please check your connection or try again later.",
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) return null;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="badge bg-success px-3 py-2 rounded-pill">
            Delivered
          </span>
        );
      case "processing":
        return (
          <span
            className="badge px-3 py-2 rounded-pill text-dark"
            style={{ backgroundColor: "#F4B400" }}
          >
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className="badge bg-dark px-3 py-2 rounded-pill">Shipped</span>
        );
      case "cancelled":
        return (
          <span className="badge bg-danger px-3 py-2 rounded-pill">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary px-3 py-2 rounded-pill">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFDF7",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <section className="py-4 mb-4" style={{ backgroundColor: "#F4B400" }}>
        <div className="container">
          <h2 className="fw-bold mb-0 text-dark">My Orders</h2>
          <p className="mb-0 text-dark" style={{ opacity: 0.8 }}>
            Track, manage, and view your order history
          </p>
        </div>
      </section>

      <div className="container flex-grow-1 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-warning"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                ></div>
                <p className="mt-3 fw-medium text-muted">
                  Fetching your real orders...
                </p>
              </div>
            ) : error ? (
              <div className="alert alert-danger rounded-4 py-3 shadow-sm border-0 bg-danger bg-opacity-10 text-danger text-center">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 text-center py-5">
                <div className="card-body py-5">
                  <div className="display-1 mb-3">📦</div>
                  <h3 className="fw-bold">No orders found</h3>
                  <p className="text-muted mb-4">
                    You haven't placed any orders yet. Let's fix that!
                  </p>
                  <Link
                    to="/allproducts"
                    className="btn px-4 py-2 rounded-3 fw-bold"
                    style={{ backgroundColor: "#F4B400", color: "#1F1F1F" }}
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {orders.map((order) => (
                  <div
                    key={order._id || order.id}
                    className="card border-0 shadow-sm rounded-4 overflow-hidden"
                  >
                    <div className="card-header bg-white p-4 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
                      <div>
                        <p className="text-muted small fw-semibold mb-1">
                          Order ID
                        </p>
                        <h5 className="fw-bold mb-0 text-dark">
                          #
                          {String(order._id || order.id)
                            .slice(-8)
                            .toUpperCase()}
                        </h5>
                      </div>
                      <div>
                        <p className="text-muted small fw-semibold mb-1">
                          Date Placed
                        </p>
                        <h6 className="mb-0 fw-semibold">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </h6>
                      </div>
                      <div>
                        <p className="text-muted small fw-semibold mb-1">
                          Total Amount
                        </p>
                        <h5 className="fw-bold mb-0 text-dark">
                          ₹
                          {order.totalAmount?.toLocaleString("en-IN") ||
                            order.total?.toLocaleString("en-IN") ||
                            0}
                        </h5>
                      </div>
                      <div className="text-lg-end">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3 border-bottom pb-2">
                        Items inside this order:
                      </h6>
                      <ul className="list-group list-group-flush mb-0">
                        {order.items?.map((item, index) => (
                          <li
                            key={index}
                            className="list-group-item px-0 py-3 border-bottom-0 d-flex justify-content-between align-items-center bg-transparent"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="bg-light rounded-3 d-flex align-items-center justify-content-center fw-bold text-muted border"
                                style={{ width: "50px", height: "50px" }}
                              >
                                {item.quantity || 1}x
                              </div>
                              <div>
                                <h6 className="fw-semibold mb-0">
                                  {item.name || item.productName || "Product"}
                                </h6>
                                <small className="text-muted">
                                  ₹{item.price || 0} per unit
                                </small>
                              </div>
                            </div>
                            <div className="fw-bold text-dark">
                              ₹
                              {(
                                (item.quantity || 1) * (item.price || 0)
                              ).toLocaleString("en-IN")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="card-footer bg-light p-3 border-top-0 d-flex justify-content-end gap-2">
                      <button className="btn btn-outline-dark fw-medium px-4 py-2 rounded-3">
                        Track Order
                      </button>
                      <button
                        className="btn fw-bold px-4 py-2 rounded-3"
                        style={{ backgroundColor: "#F4B400", color: "#1F1F1F" }}
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Orders;
