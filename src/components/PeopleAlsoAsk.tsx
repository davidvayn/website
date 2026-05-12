"use client";

import { useState } from "react";
import { faqs } from "@/data/faqs";

export default function PeopleAlsoAsk() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleQuestion(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="mb-6 max-w-[600px]">
      <h3 className="text-lg font-normal mb-3" style={{ color: "var(--text)" }}>
        People also ask
      </h3>

      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b last:border-b-0"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-sm hover:bg-[var(--hover-bg)] transition-colors"
              style={{ color: "var(--text)" }}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                style={{ color: "var(--text-secondary)" }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              </svg>
            </button>

            {openIndex === index && (
              <div
                className="px-4 pb-3 text-sm leading-6"
                style={{ color: "var(--google-snippet)" }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
