import React from "react";

const NotFound404 = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden text-center px-4 text-white">

      {/* 🟣 Animated Colorful Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute top-20 -right-20 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-2xl animate-ping"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>

      {/* 🧊 Background Frosted Blur Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md z-0" />

      {/* 🌟 Main Content (on top of blurred background) */}
      <div className="relative z-10 flex flex-col items-center">

        {/* 👻 Ghost */}
        <div className="relative w-28 h-28 bg-white rounded-t-full animate-bounce mb-6">
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            <div className="w-7 h-7 bg-white rounded-full"></div>
            <div className="w-7 h-7 bg-white rounded-full"></div>
            <div className="w-7 h-7 bg-white rounded-full"></div>
          </div>
          {/* Eyes */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
          </div>
          {/* Mouth */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-6 h-2 bg-slate-900 rounded-b-full"></div>
        </div>

        {/* 🔢 404 Text */}
        <h1 className="text-6xl font-bold text-pink-500">404</h1>
        <p className="mt-4 text-lg text-gray-300">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* 🔙 Home Button */}
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium shadow-md"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound404;
