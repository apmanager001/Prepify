"use client";

import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is Prepify and how does it work?",
      answer:
        "Prepify is an AI-powered preparation platform that creates personalized study plans based on your learning style and goals. Our system analyzes your performance, identifies weak areas, and adapts your study materials to maximize your efficiency and success rate.",
    },
    {
      question: "What types of exams does Prepify support?",
      answer:
        "We support a wide range of exams including standardized tests (SAT, ACT, GRE, GMAT), professional certifications, academic exams, and more. Our platform continuously adds new exam types based on user demand.",
    },
    {
      question: "How much does Prepify cost?",
      answer:
        "Prepify is free to use. We are working on a premium plan that will be released soon.",
    },
    {
      question: "Can I use Prepify on my mobile device?",
      answer:
        "Yes! Prepify is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers. You can study anywhere, anytime with our mobile-optimized interface.",
    },
    {
      question: "How accurate are the practice questions?",
      answer:
        "Our practice questions are carefully curated by subject matter experts and regularly updated to reflect the latest exam formats and content. We maintain a high accuracy rate and provide detailed explanations for every answer.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Absolutely! We provide 24/7 customer support through email and our comprehensive help center. Our support team is dedicated to helping you succeed and is available whenever you need assistance.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers. Here are the most common questions
            about Prepify.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-gray-50 border border-gray-200 rounded-xl"
            >
              <input
                type="radio"
                name="faq-accordion"
                checked={openIndex === index}
                onChange={() => toggleFAQ(index)}
              />
              <div className="collapse-title text-xl font-semibold text-gray-900 py-6 px-6">
                {faq.question}
              </div>
              <div className="collapse-content bg-white">
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default FAQ;
