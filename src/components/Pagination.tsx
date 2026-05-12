"use client";

export default function Pagination() {
  const letters = ["D", "v", "a", "a", "a", "a", "y", "n"];
  const colors = [
    "#4285f4",
    "#ea4335",
    "#fbbc05",
    "#4285f4",
    "#34a853",
    "#ea4335",
    "#fbbc05",
    "#4285f4",
  ];

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex items-center text-3xl tracking-widest mb-4">
        {letters.map((letter, index) => (
          <span key={index} style={{ color: colors[index], fontWeight: 500 }}>
            {letter}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span
          className="text-sm px-3 py-2"
          style={{ color: "var(--text-secondary)" }}
        >
          &lt;
        </span>
        <span
          className="text-sm px-3 py-2 font-bold"
          style={{ color: "#4285f4" }}
        >
          1
        </span>
        <span
          className="text-sm px-3 py-2 cursor-pointer hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          2
        </span>
        <span
          className="text-sm px-3 py-2 cursor-pointer hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          3
        </span>
        <span
          className="text-sm px-3 py-2 cursor-pointer hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          4
        </span>
        <span
          className="text-sm px-3 py-2 cursor-pointer hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          5
        </span>
        <span
          className="text-sm px-3 py-2 cursor-pointer hover:underline"
          style={{ color: "var(--google-blue)" }}
        >
          Next &gt;
        </span>
      </div>
    </div>
  );
}
