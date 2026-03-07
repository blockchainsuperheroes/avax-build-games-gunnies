import React from 'react';

export default function ProgressBar({ value = 0, containerClassName = 'w-full' }) {
  return (
    <div
      className={`relative w-full h-10 rounded-full overflow-hidden border-[3px] border-[#c76a00] shadow-[0_0_12px_#c76a00] bg-[#f70300] ${containerClassName}`}
    >
      <div
        className="h-full bg-gradient-to-b from-red-500 to-red-700 transition-all duration-500 ease-in-out bg-[linear-gradient(to_bottom,#ffd94d,#fca311,#e07c00)]"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
