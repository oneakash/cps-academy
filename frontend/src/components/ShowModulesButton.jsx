// components/ShowModulesButton.jsx
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ShowModulesButton({ isExpanded, onClick, moduleCount = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isExpanded}
      className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg 
                 flex items-center gap-2 hover:bg-blue-100 active:bg-blue-200 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      {isExpanded ? (
        <>
          <ChevronUp className="w-4 h-4" />
          <span>Hide Modules ({moduleCount})</span>
        </>
      ) : (
        <>
          <ChevronDown className="w-4 h-4" />
          <span>View Modules ({moduleCount})</span>
        </>
      )}
    </button>
  );
}