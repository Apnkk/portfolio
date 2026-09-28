import { motion } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const TextReveal = ({
  children,
  className = '',
  delay = 0.1,
}: TextRevealProps) => {
  const words = children.split(' ');

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-0.5">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 22,
              delay: delay + i * 0.04,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};
