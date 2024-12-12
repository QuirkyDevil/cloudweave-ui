import React, { useState } from "react";
import { X, Check, Info, ArrowDown, ArrowRight } from "lucide-react";
import {
  getModelAdvantages,
  getModelDisadvantages,
  getIdealUseCases,
} from "@/lib/data";

const SidePanel = ({
  isOpen,
  title,
  details = {},
  specifications = {},
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamically get advantages and use cases if the title is a model name
  const advantages = (title && getModelAdvantages(title)) || [];
  const disadvantages = (title && getModelDisadvantages(title)) || [];
  const useCases = (title && getIdealUseCases(title)) || [];

  // If fully closed, render a sideways button
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-[100px] transform -translate-y-1/2 rotate-90 origin-top-right bg-[#1E293B] text-white p-2 rounded-b-lg shadow-lg flex items-center space-x-2 z-50 hover:bg-neutral-00 transition-colors" >
        <Info size={20} />
        <span className="font-medium">Info</span>
      </button>
    );
  }

  return (
    <div
      className={`
        fixed
        top-0
        right-0
        h-full
        w-96
        transform
        transition-transform
        duration-300
        ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        z-50
        overflow-y-auto
        bg-[#1E293B]
        text-white
        shadow-xl
        border-l border-neutral-800
      `}
    >
      {/* Close and Collapse buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-white/70 hover:text-white"
          title="Minimize"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Header */}
      {title && (
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Details Section */}
        {Object.keys(details).length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 text-neutral-300">
              Details
            </h3>
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="mb-2 flex justify-between">
                <span className="font-medium text-neutral-400">{key}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Specifications Section */}
        {Object.keys(specifications).length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 text-neutral-300">
              Specifications
            </h3>
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="mb-2 flex justify-between">
                <span className="font-medium text-neutral-400">
                  {key + ": "}
                </span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Advantages Section */}
        {advantages.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 text-green-400">
              Advantages
            </h3>
            {advantages.map((adv, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 mb-1 text-green-200"
              >
                <Check size={16} className="text-green-500" />
                <span>{adv}</span>
              </div>
            ))}
          </div>
        )}

        {/* Disadvantages Section */}
        {disadvantages.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 text-red-400">
              Disadvantages
            </h3>
            {disadvantages.map((dis, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 mb-1 text-red-200"
              >
                <X size={16} className="text-red-500" />
                <span>{dis}</span>
              </div>
            ))}
          </div>
        )}

        {/* Ideal Use Cases */}
        {useCases.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2 text-neutral-300">
              Ideal Use Cases
            </h3>
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 mb-1 text-neutral-200"
              >
                <Info size={16} className="text-blue-500" />
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        )}

        {/* Custom Children */}
        {children}
      </div>
    </div>
  );
};

export default SidePanel;
