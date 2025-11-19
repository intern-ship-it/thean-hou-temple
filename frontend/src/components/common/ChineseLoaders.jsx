// src/components/common/ChineseLoaders.jsx
import React from "react";

// 1. 🪙 Lucky Coin Spinner - Traditional Chinese coin with square hole
export const LuckyCoinLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className={`${sizeClasses[size]} relative animate-spin`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#goldGradient)"
          stroke="#A60000"
          strokeWidth="2"
        />
        {/* Inner square hole */}
        <rect
          x="35"
          y="35"
          width="30"
          height="30"
          fill="#800000"
          stroke="#FFD54F"
          strokeWidth="2"
        />
        {/* Chinese characters decoration */}
        <text
          x="50"
          y="25"
          textAnchor="middle"
          fill="#A60000"
          fontSize="12"
          fontWeight="bold"
        >
          福
        </text>
        <text
          x="50"
          y="85"
          textAnchor="middle"
          fill="#A60000"
          fontSize="12"
          fontWeight="bold"
        >
          財
        </text>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#FFB200" />
            <stop offset="100%" stopColor="#FFD54F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// 2. 🏮 Chinese Lantern Swaying
export const LanternLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-12",
    medium: "w-16 h-24",
    large: "w-24 h-36",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="animate-sway origin-top">
        <svg viewBox="0 0 100 150" className="w-full h-full">
          {/* Hanging cord */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="20"
            stroke="#FFD54F"
            strokeWidth="2"
          />
          {/* Top decoration */}
          <circle cx="50" cy="20" r="5" fill="#FFD54F" />
          {/* Lantern body */}
          <ellipse
            cx="50"
            cy="70"
            rx="35"
            ry="45"
            fill="url(#lanternGradient)"
            stroke="#A60000"
            strokeWidth="2"
          />
          {/* Horizontal lines */}
          <line
            x1="15"
            y1="50"
            x2="85"
            y2="50"
            stroke="#A60000"
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="90"
            x2="85"
            y2="90"
            stroke="#A60000"
            strokeWidth="2"
          />
          {/* Chinese character */}
          <text
            x="50"
            y="75"
            textAnchor="middle"
            fill="#A60000"
            fontSize="20"
            fontWeight="bold"
          >
            福
          </text>
          {/* Bottom tassel */}
          <line
            x1="50"
            y1="115"
            x2="50"
            y2="135"
            stroke="#FFD54F"
            strokeWidth="3"
          />
          <circle cx="50" cy="138" r="4" fill="#A60000" />
          <defs>
            <linearGradient
              id="lanternGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#A60000" />
              <stop offset="100%" stopColor="#800000" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <style jsx>{`
        @keyframes sway {
          0%,
          100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        .animate-sway {
          animation: sway 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// 3. 🪷 Lotus Flower Blooming
export const LotusLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-32 h-32",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="animate-bloom">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Center */}
          <circle cx="50" cy="50" r="8" fill="#FFD54F" />
          {/* Petals */}
          <g className="animate-spin" style={{ transformOrigin: "50px 50px" }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="50"
                cy="30"
                rx="8"
                ry="20"
                fill="url(#lotusGradient)"
                stroke="#A60000"
                strokeWidth="1"
                transform={`rotate(${angle} 50 50)`}
                opacity="0.9"
              />
            ))}
          </g>
          <defs>
            <linearGradient
              id="lotusGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFB6C1" />
              <stop offset="100%" stopColor="#FF1493" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <style jsx>{`
        @keyframes bloom {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
        .animate-bloom {
          animation: bloom 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// 4. ☯️ Yin Yang Rotating
export const YinYangLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="white"
          stroke="#A60000"
          strokeWidth="2"
        />
        {/* Black half */}
        <path
          d="M 50 2 A 48 48 0 0 1 50 98 A 24 24 0 0 1 50 50 A 24 24 0 0 0 50 2"
          fill="#800000"
        />
        {/* Small circles */}
        <circle cx="50" cy="26" r="8" fill="white" />
        <circle cx="50" cy="74" r="8" fill="#800000" />
        {/* Gold border */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#FFD54F"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

// 5. 🏯 Temple Pagoda Building
export const PagodaLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-12 h-16",
    medium: "w-20 h-28",
    large: "w-32 h-40",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg viewBox="0 0 100 140" className="w-full h-full">
        {/* Level 1 */}
        <g className="animate-pagoda-1">
          <rect
            x="10"
            y="100"
            width="80"
            height="30"
            fill="#A60000"
            stroke="#FFD54F"
            strokeWidth="2"
          />
          <polygon points="5,100 95,100 85,90 15,90" fill="#FFD54F" />
        </g>
        {/* Level 2 */}
        <g className="animate-pagoda-2">
          <rect
            x="20"
            y="70"
            width="60"
            height="25"
            fill="#800000"
            stroke="#FFD54F"
            strokeWidth="2"
          />
          <polygon points="15,70 85,70 75,60 25,60" fill="#FFD54F" />
        </g>
        {/* Level 3 */}
        <g className="animate-pagoda-3">
          <rect
            x="30"
            y="45"
            width="40"
            height="20"
            fill="#A60000"
            stroke="#FFD54F"
            strokeWidth="2"
          />
          <polygon points="25,45 75,45 65,35 35,35" fill="#FFD54F" />
        </g>
        {/* Top */}
        <g className="animate-pagoda-4">
          <polygon
            points="40,35 60,35 50,10"
            fill="#FFD54F"
            stroke="#A60000"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="8"
            r="6"
            fill="#FFD54F"
            stroke="#A60000"
            strokeWidth="2"
          />
        </g>
      </svg>
      <style jsx>{`
        @keyframes pagoda-1 {
          0%,
          100% {
            opacity: 0.3;
            transform: translateY(20px);
          }
          25%,
          75% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pagoda-2 {
          0%,
          100% {
            opacity: 0.3;
            transform: translateY(20px);
          }
          35%,
          65% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pagoda-3 {
          0%,
          100% {
            opacity: 0.3;
            transform: translateY(20px);
          }
          45%,
          55% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pagoda-4 {
          0%,
          40% {
            opacity: 0;
            transform: translateY(20px);
          }
          50%,
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pagoda-1 {
          animation: pagoda-1 3s ease-in-out infinite;
        }
        .animate-pagoda-2 {
          animation: pagoda-2 3s ease-in-out infinite;
        }
        .animate-pagoda-3 {
          animation: pagoda-3 3s ease-in-out infinite;
        }
        .animate-pagoda-4 {
          animation: pagoda-4 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// 6. 🐉 Dragon Chasing Pearl
export const DragonPearlLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-32 h-32",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="animate-spin">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Dragon body (circular path) */}
          <path
            d="M 50 10 Q 80 30 80 50 Q 80 70 50 90 Q 20 70 20 50 Q 20 30 50 10"
            fill="none"
            stroke="url(#dragonGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Dragon head */}
          <circle
            cx="50"
            cy="8"
            r="8"
            fill="#A60000"
            stroke="#FFD54F"
            strokeWidth="2"
          />
          <circle cx="47" cy="6" r="2" fill="white" />
          <circle cx="53" cy="6" r="2" fill="white" />

          {/* Pearl in center */}
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="url(#pearlGradient)"
            stroke="#FFD54F"
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              values="10;14;10"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>

          <defs>
            <linearGradient
              id="dragonGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#A60000" />
              <stop offset="50%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#A60000" />
            </linearGradient>
            <radialGradient id="pearlGradient">
              <stop offset="0%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FFB200" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// 7. 🎋 Bamboo Growing
export const BambooLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-16",
    medium: "w-12 h-24",
    large: "w-16 h-32",
  };

  return (
    <div
      className={`${sizeClasses[size]} relative flex justify-around items-end`}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="bamboo-stalk"
          style={{
            animationDelay: `${index * 0.2}s`,
          }}
        >
          <svg viewBox="0 0 30 100" className="w-full h-full">
            <rect
              x="10"
              y="0"
              width="10"
              height="100"
              fill="url(#bambooGradient)"
              rx="5"
            />
            <line
              x1="10"
              y1="25"
              x2="20"
              y2="25"
              stroke="#2D5016"
              strokeWidth="2"
            />
            <line
              x1="10"
              y1="50"
              x2="20"
              y2="50"
              stroke="#2D5016"
              strokeWidth="2"
            />
            <line
              x1="10"
              y1="75"
              x2="20"
              y2="75"
              stroke="#2D5016"
              strokeWidth="2"
            />
            <defs>
              <linearGradient
                id="bambooGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#90EE90" />
                <stop offset="100%" stopColor="#228B22" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes grow {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scaleY(1);
          }
        }
        .bamboo-stalk {
          width: 30%;
          height: 100%;
          transform-origin: bottom;
          animation: grow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// 8. 🧧 Red Envelope Flipping
export const RedEnvelopeLoader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-10 h-14",
    medium: "w-16 h-24",
    large: "w-24 h-36",
  };

  return (
    <div className={`${sizeClasses[size]} relative perspective-1000`}>
      <div className="animate-flip-3d w-full h-full">
        <svg viewBox="0 0 100 140" className="w-full h-full">
          <rect
            x="10"
            y="10"
            width="80"
            height="120"
            fill="url(#envelopeGradient)"
            stroke="#FFD54F"
            strokeWidth="3"
            rx="5"
          />
          <rect
            x="20"
            y="50"
            width="60"
            height="40"
            fill="#FFD54F"
            opacity="0.3"
            rx="3"
          />
          <text
            x="50"
            y="75"
            textAnchor="middle"
            fill="#FFD54F"
            fontSize="24"
            fontWeight="bold"
          >
            福
          </text>
          <defs>
            <linearGradient
              id="envelopeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#A60000" />
              <stop offset="100%" stopColor="#800000" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes flip-3d {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        .animate-flip-3d {
          animation: flip-3d 2s ease-in-out infinite;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

// Export all loaders
export const ChineseLoaders = {
  LuckyCoin: LuckyCoinLoader,
  Lantern: LanternLoader,
  Lotus: LotusLoader,
  YinYang: YinYangLoader,
  Pagoda: PagodaLoader,
  DragonPearl: DragonPearlLoader,
  Bamboo: BambooLoader,
  RedEnvelope: RedEnvelopeLoader,
};

export default ChineseLoaders;
