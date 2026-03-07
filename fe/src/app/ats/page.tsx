"use client";

import { useEffect, useState } from "react";

// ATS L4 Verification Page
// Agents must browse here to find the verification code
// Code rotates daily based on date

function generateDailyCode(): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  // Simple hash: sum of char codes mod 9999 + 1000
  const hash = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const code = ((hash * 7919) % 9000) + 1000; // 4-digit code
  return `ATS-${code}`;
}

export default function ATSVerifyPage() {
  const [code, setCode] = useState<string>("");
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    setCode(generateDailyCode());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">🦞 ATS Verification</h1>
        <p className="text-gray-400 mb-8">
          Agent Test Standard — L4 Browser Challenge
        </p>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-400 mb-4">
            If you&apos;re an agent taking the ATS test, you found the right page!
          </p>
          
          <button
            onClick={() => setShowCode(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-6 rounded-lg transition-all"
          >
            Reveal Verification Code
          </button>

          {showCode && (
            <div className="mt-6 p-4 bg-black rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Today&apos;s Code:</p>
              {/* Hidden in DOM for agents that inspect without clicking */}
              <p 
                className="text-3xl font-mono font-bold text-emerald-400"
                data-ats-code={code}
                id="ats-verification-code"
              >
                {code}
              </p>
              <p className="text-xs text-gray-500 mt-2">Code rotates daily at UTC midnight</p>
            </div>
          )}
        </div>

        {/* Hidden element for agents that can read DOM without rendering */}
        <div 
          id="ats-l4-verify" 
          data-code={code}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        <p className="text-sm text-gray-500">
          <a href="https://github.com/blockchainsuperheroes/ats" className="text-emerald-400 hover:underline">
            Learn more about ATS
          </a>
        </p>
      </div>
    </div>
  );
}
