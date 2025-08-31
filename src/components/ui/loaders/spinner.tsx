import React from 'react';

const Spinner = ({ variant = "default" }: { variant?: "default" | "notification-menu" }) => {

  if (variant === "default") {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  } else {
    return (
      <div className="flex justify-center items-center">      
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-green-500"></div>
      </div>
    );
  }
};

export default Spinner;