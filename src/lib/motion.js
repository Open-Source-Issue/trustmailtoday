// src/lib/motion.js — shared Framer Motion variants

export const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.08 },
  },
};

export const heroHeading = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeUpStagger = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const cardHover = {
  rest: { y: 0, boxShadow: "0 12px 40px -12px rgba(0,0,0,.6)" },
  hover: {
    y: -6,
    boxShadow:
      "0 0 0 1px rgba(34,197,94,.25), 0 18px 50px -12px rgba(34,197,94,.25)",
    transition: { duration: 0.25 },
  },
};

export const subtleFloat = {
  animate: { y: [0, -10, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
};
