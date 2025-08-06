const Mission = () => {
  return (
    <section
      id="mission"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            To democratize education by making intelligent preparation
            accessible to every student and professional, regardless of their
            background or resources.
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
              A world where every individual has access to personalized,
              intelligent learning tools that adapt to their unique needs and
              help them achieve their full potential.
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
            <p className="text-gray-600 text-center leading-relaxed">
              Innovation, accessibility, and excellence. We believe in creating
              tools that are not only powerful but also intuitive and available
              to everyone who seeks to improve themselves.
            </p>
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
              To empower learners worldwide by providing cutting-edge
              preparation tools that transform how people study, learn, and
              succeed in their educational and professional journeys.
            </p>
          </div>
        </div>

        {/* Why We Do This */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Why We Do This
            </h3>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              Traditional study methods often leave students feeling overwhelmed
              and unprepared. We're changing that by combining artificial
              intelligence with proven learning science to create a preparation
              experience that's not just effective, but enjoyable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">The Problem</h4>
                <ul className="space-y-2 text-lg opacity-90">
                  <li>• One-size-fits-all study plans</li>
                  <li>• Limited access to quality materials</li>
                  <li>• No personalized feedback</li>
                  <li>• Inefficient study methods</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-3">Our Solution</h4>
                <ul className="space-y-2 text-lg opacity-90">
                  <li>• AI-powered personalized learning</li>
                  <li>• Comprehensive study materials</li>
                  <li>• Real-time progress tracking</li>
                  <li>• Adaptive study strategies</li>
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
