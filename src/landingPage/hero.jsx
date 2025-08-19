"use client";
import Image from "next/image";

const Hero = () => {
  return (
    <section
      className="relative bg-gradient-to-br from-base-100 via-base-50 to-primary/5 min-h-screen flex items-center"
      id="home"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Animated Flying Bees */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bee 1 */}
        <div
          className="absolute top-20 left-10 animate-bounce"
          style={{ animationDuration: "3s", animationDelay: "0s" }}
        >
          <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-warning rounded-full border-2 border-base-100"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-base-100 rounded-full opacity-80"></div>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-base-100 rounded-full opacity-80"></div>
        </div>

        {/* Bee 2 */}
        <div
          className="absolute top-32 right-20 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 bg-warning rounded-full border-2 border-base-100"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-base-100 rounded-full opacity-80"></div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-base-100 rounded-full opacity-80"></div>
        </div>

        {/* Bee 3 - Flying across */}
        <div
          className="absolute top-1/2 left-0 animate-pulse"
          style={{ animationDuration: "6s" }}
        >
          <div className="w-7 h-7 bg-warning rounded-full flex items-center justify-center shadow-lg transform rotate-12">
            <div className="w-5 h-5 bg-warning rounded-full border-2 border-base-100"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-base-100 rounded-full opacity-80"></div>
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-base-100 rounded-full opacity-80"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-base-content mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ace Your Prep
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-base-content/80 mb-8 max-w-3xl leading-relaxed">
              Personalized study plans, focus tools, and proven strategies — for
              high school, college, and beyond.
            </p>

            {/* Description */}
            <p className="text-lg text-base-content/70 mb-12 max-w-2xl">
              Prepify is a student-led nonprofit platform dedicated to helping
              anyone manage their time better, reduce study stress, and stay on
              track — whether you’re in high school, college, or pursuing
              professional certifications. We provide free, easy-to-use tools
              that help you plan, focus, and build habits that last.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-16 relative z-10">
              <button
                onClick={() => {
                  const section = document.getElementById("getStarted");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  } else {
                    console.warn("getStarted section not found");
                  }
                }}
                className="btn btn-primary btn-lg text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </button>

              <button
                onClick={() => {
                  const section = document.getElementById("mission");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="btn btn-outline btn-lg text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-base-content/70">Students in our Early Community</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">87%</div>
                <div className="text-sm text-base-content/70">Improved Focus and Better Study Habits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">20+</div>
                <div className="text-sm text-base-content/70">Schools Reached in our First Outreach</div>
              </div>
            </div>
          </div>

          {/* Right Column - Bee Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Bee Image */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="/bee.webp"
                  alt="Bee mascot for Prepify"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />

                {/* Glow effect behind bee */}
                <div className="absolute inset-0 bg-gradient-to-r from-warning/30 to-warning/10 rounded-full blur-3xl scale-110"></div>
              </div>

              {/* Floating elements around bee */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Small decorative bees */}
              <div
                className="absolute top-8 -left-8 w-6 h-6 bg-warning rounded-full animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                <div className="w-4 h-4 bg-warning rounded-full border border-base-100"></div>
              </div>
              <div
                className="absolute bottom-8 -right-8 w-5 h-5 bg-warning rounded-full animate-bounce"
                style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
              >
                <div className="w-3 h-3 bg-warning rounded-full border border-base-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-base-200/50 to-transparent"></div>
    </section>
  );
};

export default Hero;
