"use client";
import LoginForm from "@/components/organisms/login-form";
import { useEffect, useState } from "react";

const words = ["superfast", "secured"];
const Login = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="w-full h-full  flex">
      <div className="flex-1 bg-orange-50">
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
          <h1 className="text-6xl font-bold text-gray-800">Pixxy</h1>
          <p className="text-2xl font-semibold text-gray-800 transition">
            Your personal{" "}
            <span className="inherit text-orange-500">{words[index]} </span> image
            editor ✨
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
