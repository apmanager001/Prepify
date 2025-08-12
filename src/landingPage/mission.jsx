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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
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
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              The Problem We&apos;re Solving
            </h3>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              Students at all levels are struggling — not because they can&apos;t
              learn, but because they don&apos;t have a system that works for
              them.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">The Problem</h4>
                <ul className="space-y-2 text-lg opacity-90 list-disc list-inside">
                  <li>Overwhelming workloads with no clear plan</li>
                  <li>Too many distractions and no focus tools</li>
                  <li>Limited access to personalized resources</li>
                  <li>Stress and burnout before big exams</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">Our Solution</h4>
                <ul className="space-y-2 text-lg opacity-90">
                  <li><span className="font-bold">Personalized Study Plans:</span> Tailored to your time and priorities</li>
                  <li><span className="font-bold">Focus & Productivity Tools:</span> Timers, reminders, and progress tracking</li>
                  <li><span className="font-bold">Actionable Tips:</span> Weekly strategies to boost learning</li>
                  <li><span className="font-bold">Encouragement & Motivation:</span> Small wins to keep you moving forward</li>
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
