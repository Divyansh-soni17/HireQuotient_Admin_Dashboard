import React from "react";

const Loader = () => {
  return (
    <div className="flex my-4 justify-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 border-b-4   h-16 w-16"></div>
    </div>
  );
};

export default Loader;
