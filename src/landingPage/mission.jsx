import { ShieldUser, Eye, Target } from "lucide-react";

const Mission = () => {
  return (
    <section
      id="mission"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What We&apos;re Building
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe academic success shouldn&apos;t depend on expensive
            tutoring or having the &quot;perfect&quot; environment. Prepify is
            here to make effective preparation tools accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16  rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Eye size={48} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Our Vision
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              A world where every learner — from high school to grad school —
              has access to tools that fit their schedule, learning style, and
              goals.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <ShieldUser size={48} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Our Values
            </h3>
            <div className="flex justify-center">
              <ol className="text-gray-600 text-left leading-relaxed list-none list-inside">
                <li>
                  <span className="font-bold">Accessibility:</span> Free tools
                  anyone can use, anywhere.
                </li>
                <li>
                  <span className="font-bold">Student-Centered Design:</span>{" "}
                  Built around real needs and feedback.
                </li>
                <li>
                  <span className="font-bold">Focus on Well-being:</span>{" "}
                  Studying should help you grow, not burn you out.
                </li>
              </ol>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Target size={48} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Our Purpose
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              To give learners the structure, motivation, and clarity they need
              to stay organized, manage time well, and feel confident in their
              studies.
            </p>
          </div>
        </div>

        {/* Why We Do This */}
        <div className="bg-gradient-to-r from-primary/60 to-secondary/60 rounded-3xl p-8 md:p-12 text-black">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              The Problem We&apos;re Solving
            </h3>
            <p className="text-xl mb-8 leading-relaxed opacity-90 text-black/70" >
              Students at all levels are struggling — not because they
              can&apos;t learn, but because they don&apos;t have a system that
              works for them.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">The Problem</h4>
                <ul className="space-y-2 text-lg opacity-90 list-disc list-inside text-black/70">
                  <li>Overwhelming workloads with no clear plan</li>
                  <li>Too many distractions and no focus tools</li>
                  <li>Limited access to personalized resources</li>
                  <li>Stress and burnout before big exams</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">Our Solution</h4>
                <ul className="space-y-2 text-lg opacity-90 text-black/70">
                  <li>
                    <span className="font-bold">Personalized Study Plans:</span>{" "}
                    Tailored to your time and priorities
                  </li>
                  <li>
                    <span className="font-bold">
                      Focus & Productivity Tools:
                    </span>{" "}
                    Timers, reminders, and progress tracking
                  </li>
                  <li>
                    <span className="font-bold">Actionable Tips:</span> Weekly
                    strategies to boost learning
                  </li>
                  <li>
                    <span className="font-bold">
                      Encouragement & Motivation:
                    </span>{" "}
                    Small wins to keep you moving forward
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
