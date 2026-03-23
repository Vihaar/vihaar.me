import { motion } from 'framer-motion'
import BackLink from './BackLink'

interface PageShellProps {
  children: React.ReactNode
  bg?: string
  className?: string
}

export default function PageShell({ children, bg = '#0a0e1a', className = '' }: PageShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={{ background: bg }}
    >
      <BackLink />
      {children}
    </motion.div>
  )
}
