import React from "react";

export default function CheckoutWizard({ activeSteps = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap">
      {["User Login", "Shipping Adderss", "Payment Method", "Place Order"].map(
        (step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2 text-center ${
              index <= activeSteps
                ? "border-indigo-500 text-indigo-500"
                : "border-gray-400 text-gray-400"
            }`}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}
