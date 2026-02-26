/** Shared easing curve used across all page animations */
export const premiumEase = [0.16, 1, 0.3, 1] as const

/** Standard container variants for staggered children */
export const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

/** Standard card/item reveal variants */
export const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: premiumEase },
  },
}
