'use client';

import { View } from '../components/common/View';

export default function Page() {
  return (
    <View className="w-full sm:px-0 flex flex-col items-center py-8">
      <View className="flex flex-col px-[60px] space-y-4">
        <h1 className="text-white font-charka text-[20px] md:text-[30px] lg:text-[48px] font-medium w-full text-left">
          Privacy Policy
        </h1>

        <p className="text-[18px] text-white/75 font-charka mb-2">
          This privacy policy applies between you, the User of this game and website (gunnies.io and
          related services), and Avalanche Games, the developer and publisher of Gunnies. Avalanche
          Games takes the privacy of your information very seriously, especially in compliance with
          the Epic Games Developer Agreement, GDPR, and other relevant privacy laws.
        </p>

        <p className="text-[18px] text-white/75 font-charka mb-2">
          This policy applies to data collected via:
        </p>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Our official website(s)</li>
          <li>The Gunnies.io game client</li>
          <li>Epic Games Services (including login, achievements, and matchmaking)</li>
          <li>Marketing communications and customer support</li>
        </ul>

        <h2 className="text-white text-[30px] uppercase font-charka">Key Definitions</h2>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>
            <strong>Personal Data:</strong> Information that can be used to identify you (e.g.
            email, IP address, Epic ID)
          </li>
          <li>
            <strong>Processing:</strong> Any action performed on personal data (e.g. storing, using,
            transferring)
          </li>
          <li>
            <strong>Epic Services:</strong> Any service provided via Epic Online Services (EOS),
            including account linking, friend lists, and achievements
          </li>
          <li>
            <strong>User:</strong> Any player or visitor accessing our game or related websites
          </li>
        </ul>

        <h2 className="text-white text-[30px] uppercase font-charka">1. What Data We Collect</h2>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          We collect data either directly from you or via third-party services (such as Epic Games),
          including:
        </p>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Epic Games ID (if you log in using Epic)</li>
          <li>IP address, device information, operating system</li>
          <li>Game statistics, gameplay activity, progression</li>
          <li>Preferences, support requests, communication history</li>
          <li>Email address (when you contact us or opt into marketing)</li>
        </ul>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          If you choose to link your account through Epic Games, we may receive data shared through
          Epic Online Services, such as:
        </p>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Display name</li>
          <li>Friend list (if used for in-game social features)</li>
          <li>Session tokens</li>
        </ul>

        <h2 className="text-white text-[30px] uppercase font-charka">2. How We Use Your Data</h2>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Operate and improve Gunnies.io</li>
          <li>Provide support and bug resolution</li>
          <li>Deliver game features (e.g. achievements, save progress)</li>
          <li>Enforce community rules and detect cheating</li>
          <li>Send service updates or news (only with your consent)</li>
        </ul>

        <h2 className="text-white text-[30px] uppercase font-charka">3. Legal Basis</h2>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>
            <strong>Performance of a contract:</strong> To provide the game and its services
          </li>
          <li>
            <strong>Legitimate interests:</strong> To maintain security and improve player
            experience
          </li>
          <li>
            <strong>Consent:</strong> For optional features such as newsletters or marketing emails
          </li>
        </ul>

        <h2 className="text-white text-[30px] uppercase font-charka">
          4. Sharing Data with Epic Games
        </h2>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          When using Epic Games Services (like Epic Login, achievements, matchmaking), your data is
          also governed by Epic’s Privacy Policy.
        </p>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          We do not sell your data. We may share it with:
        </p>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Epic Games (as part of platform integration)</li>
          <li>Analytics providers (anonymous or aggregated usage)</li>
          <li>Payment processors (for any in-game purchases)</li>
          <li>Legal authorities, if required</li>
        </ul>

        <h2 className="text-white text-[30px] uppercase font-charka">5. Your Rights</h2>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Access your data</li>
          <li>Correct inaccuracies</li>
          <li>Request deletion ("right to be forgotten")</li>
          <li>Restrict or object to processing</li>
          <li>Data portability (get a copy of your data)</li>
          <li>Withdraw consent (at any time, for marketing, etc.)</li>
        </ul>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          To exercise your rights or for any data-related question, contact:
          <a href="mailto:hello@avalanche.games" className="text-primary underline">
            {' '}
            hello@avalanche.games
          </a>
        </p>

        <h2 className="text-white text-[30px] uppercase font-charka">6. Data Security</h2>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          We use secure servers and encryption methods where applicable. We also comply with PCI DSS
          standards and industry practices to protect your data.
        </p>

        <h2 className="text-white text-[30px] uppercase font-charka">7. Data Retention</h2>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Game account data: as long as the account is active</li>
          <li>Analytics data: anonymized or deleted within 12 months</li>
          <li>Support inquiries: up to 24 months unless legally required longer</li>
        </ul>

        <h2 className="text-white text-[30px] uppercase font-charka">8. Cookies and Tracking</h2>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          Our websites and services may use cookies for:
        </p>
        <ul className="list-disc pl-6 text-[18px] text-white/75 font-charka mb-2">
          <li>Login sessions</li>
          <li>Analytics and performance monitoring</li>
          <li>Language preferences</li>
        </ul>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          You can disable cookies in your browser settings. For more details, see our Cookies
          Policy.
        </p>

        <h2 className="text-white text-[30px] uppercase font-charka">9. Changes to This Policy</h2>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          We may update this policy to reflect changes to the game, legal requirements, or Epic
          integrations. Updates will be posted on this page with the effective date.
        </p>

        <h2 className="text-white text-[30px] uppercase font-charka">Contact</h2>
        <p className="text-[18px] text-white/75 font-charka mb-2">
          Avalanche Games
          <br />
          Email:{' '}
          <a href="mailto:hello@avalanche.games" className="text-primary underline">
            hello@avalanche.games
          </a>
          <br />
          Website:{' '}
          <a href="https://gunnies.io" className="text-primary underline">
            https://gunnies.io
          </a>
        </p>
      </View>
    </View>
  );
}
