"use client";

import React, { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../constants";
import Modal from "../../../components/Modal"; 
import { AuthContext, UserInfo } from "../../../components/authService";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      router.push("/");
      return;
    }
  }, [authenticated]);

  const handleSignup = async (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();
      setFeedbackMessage(null);
      setLoading2(true)
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "signup failed!"
      );
    }
    setFeedbackMessage("Your account has been created successfully! You can now log in.");
    setModalOpen(true);
  }catch (err) {
    setFeedbackMessage((err as Error).message);
    setModalOpen(true); 
  } finally {
    setLoading2(false);
  }
  }

  const handleLogin = async (e: React.SyntheticEvent) => {
    
   
      setLoading1(true)
      e.preventDefault();
      setFeedbackMessage(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            "This Account does not Exist, Please Sign up and come back again!"
        );
      }

      const data = await res.json();
      const user: UserInfo = {
        username: data.username,
        id: data.id,
      };

      sessionStorage.setItem("user_info", JSON.stringify(user));
      router.push("/");
    } catch (err) {
      setFeedbackMessage((err as Error).message);
      setModalOpen(true); 
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=600)",
      }}
    >
      <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-2xl backdrop-blur-md max-sm:px-8">
        <div className="text-white">
          <div className="mb-8 flex flex-col items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/128/566/566718.png"
              width="100"
              alt="ApolloChat Logo"
            />
            <h1 className="mt-4 text-3xl font-serif">ApolloChat</h1>
            <span className="text-gray-300 mt-4">Enter Login Details:</span>
          </div>
         
            <div className="mb-4 text-lg relative">
              <input
                className="rounded-full font-bold bg-coolGrey bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                type="text"
                name="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4 text-lg relative">
              <input
                className="rounded-full border-none font-bold bg-coolGrey bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="mt-8 flex justify-between text-lg text-black">
              <button
                type="submit"
                disabled={loading1} 
                onClick={handleLogin}
                style={{ width: '120px' }}
                className="text-md rounded-3xl bg-yellow-200 bg-opacity-50 text-white shadow-xl backdrop-blur-md transition-colors duration-900 hover:bg-blue flex justify-center items-center" 
              >
                {loading1 ? "Loading..." : "Login"}
              </button>

              <p className="text-white text-3xl">|</p>

              <button
                type="submit"
                style={{ width: '120px' }}
                onClick={handleSignup}
                disabled={loading2} 
                className="text-md rounded-3xl bg-yellow-200 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-900 hover:bg-blue flex justify-center items-center"
              >
                {loading2 ? "Loading..." : "signup"}
              </button>
            </div>
          
        </div>
      </div>

      {/* Modal Component */}
      {modalOpen && (
        <Modal
          message={feedbackMessage || "An unexpected error occurred."}
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Index;
