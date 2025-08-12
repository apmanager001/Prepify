"use client";

import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is Prepify?",
      answer: (
        <p>
          <strong>Prepify</strong> is a free online platform that helps you
          create personalized study plans, stay focused, and reduce academic
          stress — whether you&apos;re in high school, college, or pursuing
          further education.
        </p>
      ),
    },
    {
      question: "Who is Prepify for?",
      answer: (
        <p>
          Anyone preparing for exams, coursework, or professional certifications
          — especially those who want structure and tools that actually fit
          their life.
        </p>
      ),
    },
    {
      question: "What kinds of exams can Prepify help me prepare for?",
      answer: (
        <p>
          <strong>Prepify</strong> is designed to support students preparing for
          any type of exam by helping them stay organized, manage their study
          time effectively, and reduce academic stress. Whether you&apos;re
          taking the SAT, AP tests, college finals, or professional
          certification exams, our tools help you stay focused and ready.
        </p>
      ),
    },
    {
      question: "How much does it cost?",
      answer: (
        <p>
          <strong>Prepify</strong> is completely <strong>FREE!</strong> Our goal
          is to keep it that way for core tools.
        </p>
      ),
    },
    {
      question: "Can I use Prepify on my phone?",
      answer: (
        <p>
          Yes, — our site works on any device, so you can plan and track your
          study sessions anywhere.
        </p>
      ),
    },
    {
      question: "Is Prepify only for test prep?",
      answer: (
        <p>
          No, — our tools are for everyday studying too. From organizing your
          assignments to preparing for big tests, Prepify helps you stay on
          track.
        </p>
      ),
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
            Got Questions? We&apos;ve Got You.
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
                  <div className="text-gray-600 leading-relaxed">{faq.answer}</div>
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
