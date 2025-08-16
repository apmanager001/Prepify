import React from "react";

const Donations = () => {
  return (
    <div
      id="donations"
      className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 py-16"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Donations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Any donations are appreciated and help provide free study guides to students
          </p>
        </div>

        {/* Donation Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl relative overflow-hidden">
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "600px",
                width: "100%",
              }}
            >
              <iframe
                title="Donation form powered by Zeffy"
                style={{
                  position: "absolute",
                  border: "0",
                  top: "0",
                  left: "0",
                  bottom: "0",
                  right: "0",
                  width: "100%",
                  height: "100%",
                }}
                src="https://www.zeffy.com/embed/donation-form/bring-personalized-ai-study-plans-to-life"
                allowpaymentrequest="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
