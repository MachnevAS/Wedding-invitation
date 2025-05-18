
'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  animationClassName: string;
  delayClassName?: string;
  threshold?: number;
  triggerOnce?: boolean;
  as?: React.ElementType;
  initialClass?: string;
}

export function ScrollReveal({
  children,
  className,
  animationClassName,
  delayClassName = '',
  threshold = 0.1,
  triggerOnce = true,
  as: Component = 'div',
  initialClass = 'opacity-0', // Elements are hidden by default until they enter viewport
  ...props // Captures other props like style, id, etc.
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce && currentRef) {
            observer.unobserve(currentRef);
          }
        } else {
          if (!triggerOnce) {
            // Option to re-trigger animation if element scrolls out and back in
            setIsInView(false);
          }
        }
      },
      { threshold }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, triggerOnce]);

  return (
    <Component
      ref={ref}
      className={cn(
        className, // User-provided classes for the wrapper (styling, layout)
        isInView ? `${animationClassName} ${delayClassName}` : initialClass
      )}
      {...props} // Spread other props like style here
    >
      {children}
    </Component>
  );
}
