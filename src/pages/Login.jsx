import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../auth/useAuthStore";
import illustration from "../assets/otp-security.svg";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const from = location.state?.from?.pathname || "/";

  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpId, setOtpId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    cCode: "+91",
    phoneNo: "",
    password: "",
    otp: "",
  });

  const basicAuth = {
    username: import.meta.env.VITE_BASIC_USER,
    password: import.meta.env.VITE_BASIC_PASS,
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSendOtp = async () => {
    const response = await api.post(
      "/v1/users/send-otp",
      { cCode: form.cCode, phoneNo: form.phoneNo, via: "login" },
      { auth: basicAuth },
    );
    const receivedOtpId =
      response?.data?.data?.otpId ||
      response?.data?.otpId ||
      response?.data?.data?._id;

    if (receivedOtpId) {
      setOtpId(receivedOtpId);
      setStep("otp");
      setSuccess("OTP sent! (Test: 5252)");
    } else {
      setError("Failed to retrieve OTP ID.");
    }
  };

  const performLogin = async () => {
    const response = await api.post(
      "/v1/users/login",
      { cCode: form.cCode, phoneNo: form.phoneNo, password: form.password },
      { auth: basicAuth },
    );
    const token =
      response?.data?.data?.token ||
      response?.data?.token ||
      response?.headers?.authorization?.split(" ")[1];

    const backendUser =
      response?.data?.data?.user || response?.data?.data || {};

    const userData = {
      name: backendUser.name || "Verified User",
      email: backendUser.email || "",
      gender: backendUser.gender || "",
      phoneNo: backendUser.phoneNo || form.phoneNo,
      cCode: backendUser.cCode || form.cCode,
    };

    if (token) {
      login({ token: token, user: userData });
      navigate(from, { replace: true });
    } else {
      setError("Login success, but no token returned.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (step === "register") {
        if (!form.name || !form.phoneNo || !form.password)
          throw new Error("Name, Phone, and Password are required.");
        await api.post(
          "/v1/users/register",
          {
            name: form.name,
            email: form.email || "test@gmail.com",
            cCode: form.cCode,
            phoneNo: form.phoneNo,
            password: form.password,
            gender: "male",
          },
          { auth: basicAuth },
        );
        await handleSendOtp();
      } else if (step === "login") {
        if (!form.phoneNo || !form.password)
          throw new Error("Credentials required.");
        try {
          await performLogin();
        } catch (loginErr) {
          if (
            loginErr.response?.data?.message
              ?.toLowerCase()
              .includes("not verified")
          ) {
            await handleSendOtp();
          } else {
            throw loginErr;
          }
        }
      } else if (step === "otp") {
        if (!form.otp) throw new Error("Enter verification code.");
        await api.post(
          "/v1/users/verify-otp",
          {
            cCode: form.cCode,
            phoneNo: form.phoneNo,
            via: "login",
            otpId: otpId,
            otp: parseInt(form.otp, 10),
          },
          { auth: basicAuth },
        );
        await performLogin();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-100 text-gray-900 text-lg rounded-2xl focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 focus:bg-white block p-4 transition-all duration-300 ease-out placeholder-gray-400 font-medium outline-none";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 w-full h-full bg-white isolate z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-yellow-100/60 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob"></div>
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-orange-50/60 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-amber-50/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[80px]"></div>
      </div>

      <div className="relative w-full max-w-[1100px] h-auto lg:h-[750px] m-4 grid lg:grid-cols-2 rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.06)] border border-white/60 bg-white/40 backdrop-blur-2xl overflow-hidden z-10 transition-shadow duration-500 hover:shadow-[0_45px_80px_-15px_rgba(0,0,0,0.08)]">
        <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 opacity-95 z-0"></div>
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/noise.png')] z-0"></div>
          <div className="relative z-10 text-center transform transition-transform duration-700 group-hover:scale-105">
            <div className="bg-white/20 p-6 rounded-full backdrop-blur-md shadow-lg border border-white/20 mb-8 inline-block">
              <img
                src={illustration}
                alt="Studio Graphics"
                className="w-full max-w-[280px] drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
              />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
              Studio Graphics
            </h2>
            <div className="w-16 h-1.5 bg-white/60 rounded-full mx-auto mb-6 backdrop-blur-sm"></div>
            <p className="text-lg text-white/95 font-medium leading-relaxed max-w-sm mx-auto tracking-wide">
              Unlock your creative vault. <br />
              Turn your vision into reality.
            </p>
          </div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white/60 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-yellow-100/50 border border-yellow-200 text-yellow-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                {step === "otp" ? "Authentication" : "Secure Access"}
              </span>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                {step === "register"
                  ? "Create Account"
                  : step === "otp"
                    ? "Security Check"
                    : "Welcome Back"}
              </h3>
              <p className="text-gray-500 font-medium">
                {step === "register"
                  ? "Join the studio today."
                  : step === "otp"
                    ? "Enter the code sent to your mobile."
                    : "Please enter your details to sign in."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === "register" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </>
              )}

              {step !== "otp" && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="cCode"
                    value={form.cCode}
                    onChange={handleChange}
                    className={`${inputClass} w-[80px] text-center px-0 bg-gray-50/30`}
                  />
                  <input
                    type="tel"
                    name="phoneNo"
                    placeholder="Phone Number"
                    value={form.phoneNo}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              )}

              {step !== "otp" && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                />
              )}

              {step === "otp" && (
                <input
                  type="text"
                  name="otp"
                  placeholder="••••••"
                  maxLength="6"
                  autoFocus
                  value={form.otp}
                  onChange={handleChange}
                  className={`${inputClass} text-center text-3xl tracking-[1rem] font-bold h-24 bg-white shadow-sm`}
                />
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-semibold animate-pulse flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-green-50/80 border border-green-100 text-green-600 text-sm font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-[#F4B400] hover:bg-[#dca200] text-white text-lg font-bold shadow-[0_8px_20px_-6px_rgba(244,180,0,0.6)] hover:shadow-[0_12px_24px_-8px_rgba(244,180,0,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : step === "register" ? (
                  "Create Account"
                ) : step === "otp" ? (
                  "Verify & Enter"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              {step === "otp" ? (
                <button
                  onClick={() => {
                    setStep("login");
                    setForm({ ...form, otp: "" });
                    setError("");
                  }}
                  className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  ← Back to Login
                </button>
              ) : (
                <p className="text-gray-400 text-sm font-medium">
                  {step === "register"
                    ? "Already have a studio ID?"
                    : "New to Studio Graphics?"}
                  <button
                    onClick={() => {
                      setStep(step === "register" ? "login" : "register");
                      setError("");
                    }}
                    className="ml-2 text-[#F4B400] hover:text-[#dca200] font-bold transition-colors"
                  >
                    {step === "register" ? "Sign In" : "Create Account"}
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
