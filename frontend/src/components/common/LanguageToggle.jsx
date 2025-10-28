import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setLanguage } from "../../features/language/languageSlice";

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.currentLanguage);

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === "en" ? "zh" : "en";
    dispatch(setLanguage(newLanguage));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLanguageToggle}
      className="relative p-2 rounded-xl bg-gradient-to-br from-amber-100 to-red-100 hover:from-amber-200 hover:to-red-200 transition-all duration-500 shadow-md border border-amber-300 overflow-hidden min-w-[80px] h-[44px]"
    >
      {/* Ambient glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-amber-300 to-red-300 rounded-xl"
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sliding background indicator with smooth trail */}
      <motion.div
        className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg shadow-xl overflow-hidden"
        animate={{
          left: currentLanguage === "en" ? "6px" : "calc(50% + 0px)",
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
          mass: 0.8,
        }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-amber-600" />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1,
          }}
        />
      </motion.div>

      {/* Language options container */}
      <div className="relative flex items-center h-full px-2">
        {/* EN Option */}
        <motion.div
          className="flex-1 flex items-center justify-center relative z-10"
          animate={{
            scale: currentLanguage === "en" ? 1.05 : 0.95,
            y: currentLanguage === "en" ? -1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.5,
          }}
        >
          <motion.span
            className="text-sm font-bold"
            animate={{
              color: currentLanguage === "en" ? "#ffffff" : "#92400e",
              textShadow:
                currentLanguage === "en"
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            EN
          </motion.span>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          className="w-px h-5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 mx-0.5"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 中文 Option */}
        <motion.div
          className="flex-1 flex items-center justify-center relative z-10"
          animate={{
            scale: currentLanguage === "zh" ? 1.05 : 0.95,
            y: currentLanguage === "zh" ? -1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.5,
          }}
        >
          <motion.span
            className="text-sm font-bold"
            animate={{
              color: currentLanguage === "zh" ? "#ffffff" : "#92400e",
              textShadow:
                currentLanguage === "zh"
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            中文
          </motion.span>
        </motion.div>
      </div>

      {/* Ripple effect on toggle */}
      <motion.div
        key={currentLanguage}
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{
          scale: [0, 2.5, 3],
          opacity: [0.6, 0.3, 0],
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none"
      >
        <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg" />
      </motion.div>

      {/* Particle burst effect */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`${currentLanguage}-${i}`}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (i % 2 ? 1 : -1) * 15 * Math.cos((i * Math.PI) / 2)],
            y: [0, (i % 2 ? 1 : -1) * 15 * Math.sin((i * Math.PI) / 2)],
            opacity: [1, 0.6, 0],
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: i * 0.05,
          }}
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-400 rounded-full pointer-events-none"
        />
      ))}
    </motion.button>
  );
};

export default LanguageToggle;
