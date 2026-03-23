import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BackLink() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-6 left-6 z-50"
    >
      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50/95 border-2 border-stone-400 text-stone-800 hover:bg-amber-100/95 hover:border-stone-500 transition-colors text-sm font-hand shadow-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        back to map
      </Link>
    </motion.div>
  )
}
