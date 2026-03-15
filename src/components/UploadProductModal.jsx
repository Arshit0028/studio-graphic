import { useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi"; // Added premium icons
import useAuthStore from "../auth/useAuthStore";
import api from "../api/axios";

const MATERIAL_OPTIONS = [
  "Corrugated Box",
  "Kraft Paper",
  "Rigid Box",
  "Cardboard",
  "Eco-Friendly",
  "Premium Magnetic Box",
];

function UploadProductModal({ show, onClose }) {
  const currentUser = useAuthStore((state) => state.user);
  const currentToken = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // New state for premium drag-n-drop UI
  const [success, setSuccess] = useState(false); // Premium success state

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (show && currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phoneNo || "");
    }
  }, [show, currentUser]);

  // Reset states when closed
  useEffect(() => {
    if (!show) {
      setTimeout(() => setSuccess(false), 300);
    }
  }, [show]);

  if (!show) return null;

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    if (images.length + fileArray.length > 6) {
      alert("Maximum 6 images allowed.");
      return;
    }
    setImages((prev) => [...prev, ...fileArray]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMaterialToggle = (material) => {
    setMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material],
    );
  };

  const fetchGuestToken = async () => {
    try {
      const guestUsername = import.meta.env.VITE_BASIC_USER;
      const guestPassword = import.meta.env.VITE_BASIC_PASS;

      if (!guestUsername || !guestPassword) return null;

      const credentials = btoa(`${guestUsername}:${guestPassword}`);
      const response = await api.post("/v1/users/guest-login", null, {
        headers: { Authorization: `Basic ${credentials}` },
      });

      const authHeader = response.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.replace("Bearer ", "");
      }
      return null;
    } catch (error) {
      console.error("Guest Login Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name || "Guest User");
      formData.append("email", email || "guest@example.com");
      formData.append("phone", phone || "0000000000");

      const detailString = `Product: ${productName}\nMaterials: ${materials.join(", ")}\nNotes: ${description}`;
      formData.append("description", detailString);

      images.forEach((file) => {
        formData.append("media", file);
      });

      let finalToken = currentToken ? currentToken.replace(/^"|"$/g, "") : null;

      if (!finalToken) {
        finalToken = await fetchGuestToken();
        if (finalToken) {
          setToken(finalToken);
        } else {
          alert("🚨 Session error. Please try again.");
          setLoading(false);
          return;
        }
      }

      await api.post("/v1/queries", formData, {
        headers: { Authorization: `Bearer ${finalToken}` },
      });

      // Show beautiful success state
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setProductName("");
        setDescription("");
        setMaterials([]);
        setImages([]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Upload Error:", error);
      const errorData = error.response?.data;
      alert(`🚨 Error: ${errorData?.message || "Could not complete request."}`);
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(5px)",
        position: "fixed",
        inset: 0,
        zIndex: 1050,
      }}
    >
      <div
        className="modal-container bg-white shadow-lg d-flex flex-column"
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "85vh",
          borderRadius: "16px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          transform: show ? "scale(1)" : "scale(0.95)",
          opacity: show ? 1 : 0,
        }}
      >
        {success ? (
          // Premium Success View
          <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center h-100">
            <FiCheckCircle size={64} className="text-success mb-3" />
            <h4 className="fw-bold text-dark">Inquiry Submitted</h4>
            <p className="text-muted">
              Our design team will review your request and get back to you
              shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom bg-light">
              <h5 className="mb-0 fw-bold" style={{ color: "#2c3e50" }}>
                Design Your Packaging
              </h5>
              <button
                type="button"
                className="btn border-0 p-1 rounded-circle"
                onClick={onClose}
                disabled={loading}
                style={{ backgroundColor: "transparent" }}
              >
                <FiX size={24} className="text-muted" />
              </button>
            </div>

            {/* Body */}
            <div
              className="p-4"
              style={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}
            >
              <form id="productQueryForm" onSubmit={handleSubmit}>
                {/* Contact Info (Readonly) */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small text-muted fw-semibold mb-1">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 shadow-none px-3 py-2 rounded-3"
                      value={name}
                      readOnly={!!currentUser}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted fw-semibold mb-1">
                      PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 shadow-none px-3 py-2 rounded-3"
                      value={phone}
                      readOnly={!!currentUser}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Main Inputs */}
                <div className="mb-4">
                  <label className="form-label small text-muted fw-semibold mb-1">
                    PRODUCT NAME / TYPE *
                  </label>
                  <input
                    type="text"
                    className="form-control shadow-none px-3 py-2 rounded-3 border"
                    placeholder="e.g. Matte Finish Perfume Box"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small text-muted fw-semibold mb-1">
                    ADDITIONAL DETAILS
                  </label>
                  <textarea
                    className="form-control shadow-none px-3 py-2 rounded-3 border"
                    rows="3"
                    placeholder="Dimensions, finish types, specific requirements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </div>

                {/* Premium Material Pills */}
                <div className="mb-4">
                  <label className="form-label small text-muted fw-semibold mb-2">
                    BOX TYPES / MATERIALS
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {MATERIAL_OPTIONS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        disabled={loading}
                        className={`btn btn-sm px-3 py-1 ${materials.includes(m) ? "btn-dark shadow-sm" : "btn-outline-secondary"}`}
                        style={{
                          borderRadius: "20px",
                          transition: "all 0.2s",
                          border: materials.includes(m)
                            ? "1px solid #212529"
                            : "1px solid #dee2e6",
                        }}
                        onClick={() => handleMaterialToggle(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drag & Drop Upload Zone */}
                <div className="mb-3">
                  <label className="form-label small text-muted fw-semibold mb-2">
                    REFERENCE IMAGES (Max 6)
                  </label>
                  <div
                    className={`p-4 text-center rounded-4 border-2 ${isDragging ? "border-primary bg-primary bg-opacity-10" : "border-dashed border-secondary bg-light"}`}
                    style={{
                      borderStyle: "dashed",
                      cursor: loading ? "default" : "pointer",
                      transition: "all 0.3s",
                    }}
                    onClick={() => !loading && fileInputRef.current.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                  >
                    <FiUploadCloud
                      size={32}
                      className={`mb-2 ${isDragging ? "text-primary" : "text-secondary"}`}
                    />
                    <h6 className="mb-1 text-dark">
                      Click or drag images here
                    </h6>
                    <p className="small text-muted mb-0">JPEG, PNG up to 5MB</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      ref={fileInputRef}
                      onChange={(e) => handleFiles(e.target.files)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="row g-2 mt-2">
                    {images.map((img, i) => (
                      <div key={i} className="col-4 col-sm-3 position-relative">
                        <button
                          type="button"
                          className="btn-close position-absolute top-0 end-0 bg-white m-1 shadow-sm"
                          style={{ padding: "0.3rem", zIndex: 2 }}
                          onClick={() => removeImage(i)}
                          disabled={loading}
                        ></button>
                        <div
                          className="rounded-3 overflow-hidden shadow-sm border"
                          style={{ aspectRatio: "1", position: "relative" }}
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            className="w-100 h-100 object-fit-cover"
                            alt={`preview-${i}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Premium Footer Button */}
            <div className="px-4 py-3 bg-white border-top">
              <button
                type="submit"
                form="productQueryForm"
                className="btn btn-dark w-100 py-2 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center"
                disabled={loading || !productName}
                style={{ transition: "all 0.2s" }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Uploading...
                  </>
                ) : (
                  "Submit Design Inquiry"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UploadProductModal;
