"use client";

interface ScrollCueProps {
  className?: string;
  label: string;
  onClick: () => void;
  testId: string;
}

export function ScrollCue({ className = "", label, onClick, testId }: ScrollCueProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={label}
      onClick={onClick}
      className={`group relative flex cursor-pointer items-center justify-center rounded-none text-primary outline-none transition-transform duration-300 ease-out hover:scale-[1.04] focus-visible:scale-[1.04] focus-visible:ring-2 focus-visible:ring-primary/50 ${className}`}
    >
      <ScrollHintSvg />
    </button>
  );
}

function ScrollHintSvg() {
  return (
    <>
      <style jsx>{`
        @keyframes grayDraw {
          0% { stroke-dashoffset: var(--len); }
          17% { stroke-dashoffset: 0; }
          87% { stroke-dashoffset: 0; opacity: 1; }
          95% { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: var(--len); opacity: 0; }
        }
        @keyframes blueDraw {
          0% { stroke-dashoffset: var(--len); opacity: 0; }
          16% { stroke-dashoffset: var(--len); opacity: 0; }
          17% { stroke-dashoffset: var(--len); opacity: 1; }
          34% { stroke-dashoffset: 0; opacity: 1; }
          87% { stroke-dashoffset: 0; opacity: 1; }
          95% { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: var(--len); opacity: 0; }
        }
        @keyframes dotBounce {
          0% { transform: translateY(0px); opacity: 0; }
          34% { transform: translateY(0px); opacity: 0; }
          35% { transform: translateY(0px); opacity: 1; }
          39% { transform: translateY(8px); opacity: 1; }
          43% { transform: translateY(0px); opacity: 1; }
          47% { transform: translateY(8px); opacity: 1; }
          51% { transform: translateY(0px); opacity: 1; }
          55% { transform: translateY(8px); opacity: 1; }
          59% { transform: translateY(0px); opacity: 1; }
          63% { transform: translateY(8px); opacity: 1; }
          67% { transform: translateY(0px); opacity: 1; }
          71% { transform: translateY(8px); opacity: 1; }
          75% { transform: translateY(0px); opacity: 1; }
          79% { transform: translateY(8px); opacity: 1; }
          83% { transform: translateY(0px); opacity: 1; }
          87% { transform: translateY(8px); opacity: 1; }
          95% { transform: translateY(18px); opacity: 0; }
          100% { transform: translateY(0px); opacity: 0; }
        }
        @keyframes chev1Draw {
          0% { stroke-dashoffset: var(--clen); opacity: 0; }
          53% { stroke-dashoffset: var(--clen); opacity: 0; }
          54% { stroke-dashoffset: var(--clen); opacity: 1; }
          61% { stroke-dashoffset: 0; opacity: 1; }
          87% { stroke-dashoffset: 0; opacity: 1; }
          95% { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: var(--clen); opacity: 0; }
        }
        @keyframes chev1Bounce {
          0% { transform: translateY(0px); }
          55% { transform: translateY(8px); }
          59% { transform: translateY(0px); }
          63% { transform: translateY(8px); }
          67% { transform: translateY(0px); }
          71% { transform: translateY(8px); }
          75% { transform: translateY(0px); }
          79% { transform: translateY(8px); }
          83% { transform: translateY(0px); }
          87% { transform: translateY(8px); }
          95% { transform: translateY(18px); }
          100% { transform: translateY(0px); }
        }
        @keyframes chev2Draw {
          0% { stroke-dashoffset: var(--clen); opacity: 0; }
          64% { stroke-dashoffset: var(--clen); opacity: 0; }
          65% { stroke-dashoffset: var(--clen); opacity: 1; }
          72% { stroke-dashoffset: 0; opacity: 1; }
          87% { stroke-dashoffset: 0; opacity: 1; }
          95% { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: var(--clen); opacity: 0; }
        }
        @keyframes chev2Bounce {
          0% { transform: translateY(0px); }
          63% { transform: translateY(8px); }
          67% { transform: translateY(0px); }
          71% { transform: translateY(8px); }
          75% { transform: translateY(0px); }
          79% { transform: translateY(8px); }
          83% { transform: translateY(0px); }
          87% { transform: translateY(8px); }
          95% { transform: translateY(18px); }
          100% { transform: translateY(0px); }
        }
        .scrollWrap {
          --len: 192;
          --clen: 18.4;
          --anim-duration: 6s;
          --start-delay: -0.24s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 66px;
          height: 66px;
        }
        @media (min-width: 768px) {
          .scrollWrap {
            width: 78px;
            height: 78px;
          }
        }
        .scrollWrap :global(#gm) {
          stroke-dasharray: var(--len);
          stroke-dashoffset: var(--len);
          animation: grayDraw var(--anim-duration) cubic-bezier(.4,0,.6,1) infinite;
          animation-delay: var(--start-delay);
          animation-fill-mode: both;
        }
        .scrollWrap :global(#bm) {
          stroke-dasharray: var(--len);
          stroke-dashoffset: var(--len);
          opacity: 0;
          animation: blueDraw var(--anim-duration) cubic-bezier(.1,0,.2,1) infinite;
          animation-delay: var(--start-delay);
          animation-fill-mode: both;
        }
        .scrollWrap :global(#dot) {
          opacity: 0;
          animation: dotBounce var(--anim-duration) ease-in-out infinite;
          animation-delay: var(--start-delay);
          animation-fill-mode: both;
          transform-origin: 36px 26px;
        }
        .scrollWrap :global(#chev1) {
          stroke-dasharray: var(--clen);
          stroke-dashoffset: var(--clen);
          opacity: 0;
          animation: chev1Draw var(--anim-duration) ease-in-out infinite, chev1Bounce var(--anim-duration) ease-in-out infinite;
          animation-delay: var(--start-delay), var(--start-delay);
          animation-fill-mode: both, both;
          transform-origin: 36px 43px;
        }
        .scrollWrap :global(#chev2) {
          stroke-dasharray: var(--clen);
          stroke-dashoffset: var(--clen);
          opacity: 0;
          animation: chev2Draw var(--anim-duration) ease-in-out infinite, chev2Bounce var(--anim-duration) ease-in-out infinite;
          animation-delay: var(--start-delay), var(--start-delay);
          animation-fill-mode: both, both;
          transform-origin: 36px 50px;
        }
      `}</style>
      <div className="scrollWrap">
        <svg
          data-testid="home-scroll-svg"
          width="108"
          height="108"
          viewBox="0 0 72 72"
          fill="none"
          aria-label="Scroll down hint"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="gm"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M18 6 H54 V66 H18 Z"
          />
          <path
            id="bm"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M18 6 H54 V66 H18 Z"
          />
          <rect id="dot" x="33" y="23" width="6" height="6" fill="currentColor" opacity="0" />
          <path
            id="chev1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M29.5,40 L36,46.5 L42.5,40"
            opacity="0"
          />
          <path
            id="chev2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M29.5,47 L36,53.5 L42.5,47"
            opacity="0"
          />
        </svg>
      </div>
    </>
  );
}
