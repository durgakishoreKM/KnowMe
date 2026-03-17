import { motion } from "framer-motion"

function SectionCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="
        bg-white 
        rounded-2xl 
        shadow-sm 
        hover:shadow-lg 
        transition-all 
        duration-300 
        hover:-translate-y-1
        p-10
      "
    >
      {children}
    </motion.div>
  )
}

export default SectionCard