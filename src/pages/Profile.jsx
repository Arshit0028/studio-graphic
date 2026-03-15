import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../auth/useAuthStore";
import Footer from "../components/Footer";

function Profile() {
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const fullName = user?.name || "Verified User";
  const email = user?.email || "No email provided";
  const phone = user?.phoneNo
    ? `${user?.cCode || "+91"} ${user.phoneNo}`
    : "No phone number linked";
  const gender = user?.gender
    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
    : "Not specified";

  const handleLogout = () => {
    logout();
    navigate("/");
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
      {/* Yellow Banner */}
      <section className="py-4 mb-4" style={{ backgroundColor: "#F4B400" }}>
        <div className="container">
          <h2 className="fw-bold mb-0 text-dark">My Account</h2>
          <p className="mb-0 text-dark" style={{ opacity: 0.8 }}>
            Manage your profile and personal details
          </p>
        </div>
      </section>

      <div className="container flex-grow-1 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white p-4 border-bottom d-flex align-items-center gap-4">
                <div
                  className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "32px",
                    backgroundColor: "#1F1F1F",
                  }}
                >
                  {userInitial}
                </div>
                <div>
                  <h3 className="fw-bold mb-1" style={{ color: "#1F1F1F" }}>
                    {fullName}
                  </h3>
                  <span
                    className="badge px-3 py-2 rounded-pill"
                    style={{ backgroundColor: "#F4B400", color: "#000" }}
                  >
                    Active Account
                  </span>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                <h5 className="fw-bold mb-4 border-bottom pb-2">
                  Personal Information
                </h5>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold mb-1">
                      Full Name
                    </label>
                    <div className="p-3 bg-light rounded-3 fw-medium text-dark border">
                      {fullName}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold mb-1">
                      Phone Number
                    </label>
                    <div className="p-3 bg-light rounded-3 fw-medium text-dark border d-flex justify-content-between align-items-center">
                      <span>{phone}</span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "#1F1F1F",
                          fontSize: "0.7rem",
                        }}
                      >
                        Verified ✓
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold mb-1">
                      Email Address
                    </label>
                    <div className="p-3 bg-light rounded-3 fw-medium text-dark border">
                      {email}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold mb-1">
                      Gender
                    </label>
                    <div className="p-3 bg-light rounded-3 fw-medium text-dark border">
                      {gender}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-top d-flex flex-wrap gap-3">
                  <button
                    className="btn px-4 py-2 rounded-3 fw-bold shadow-sm"
                    style={{ backgroundColor: "#F4B400", color: "#fff" }}
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger px-4 py-2 rounded-3 fw-bold ms-auto"
                  >
                    🚪 Logout
                  </button>
                </div>
                <p className="text-muted small mt-3 mb-0">
                  Note: If your data says "No email provided", it means the
                  backend only sent the security token during login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
