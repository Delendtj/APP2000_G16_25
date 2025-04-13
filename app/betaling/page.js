"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import betaling from "./betaling.css";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Betaling = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
 
  const clubId = searchParams.get("clubId");

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://vast-mesa-22158-90c21fc001d1.herokuapp.com"
      : "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);
    } else {
      console.error("No user object found in localStorage.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.name &&
      formData.email &&
      formData.cardNumber &&
      formData.expiry &&
      formData.cvv
    ) {
      setMessage("betaling gjennomført!");
    } else {
      setMessage("Vennligst fyll ut alle felt.");
    }

    try {
      const response = await fetch(`${baseUrl}/api/newmember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, clubId }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Failed to sign up for the club");
      }

      setMessage("Betaling gjennført og registrert i klubben!");
      // Redirect to the "klubber" page after successful payment
      setTimeout(() => router.push("/klubber"), 2000);
    } catch (err) {
      const errorMsg = err.message || "something went wrong during sign - up.";
      setMessage(errorMsg);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          padding: "2rem",
          width: "600px",
          margin: "0 auto",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Fullt navn"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-post"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="cardNumber"
            placeholder="Kortnummer"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="expiry"
            placeholder="Utløpsdato (MM/ÅÅ)"
            value={formData.expiry}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={{
              padding: "0.75rem",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Betal nå
          </button>
        </form>
        {message && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "0.75rem",
              margin: "1rem 0",
              border: "1px solidrgb(164, 29, 43)",
              borderRadius: "4px",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default Betaling;
