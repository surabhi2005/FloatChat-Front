import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const AnimatedContent = ({
  children,
  distance = 150,
  direction = "horizontal",
  reverse = false,
  duration = 1.2,
  ease = "bounce.out",
  initialOpacity = 0.2,
  animateOpacity = true,
  scale = 1.1,
  threshold = 0.2,
  delay = 0.3,
  className = "",
  ...props
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state
    const initialTransform = {
      x: direction === "horizontal" ? (reverse ? distance : -distance) : 0,
      y: direction === "vertical" ? (reverse ? distance : -distance) : 0,
      opacity: animateOpacity ? initialOpacity : 1,
      scale: scale
    };

    gsap.set(element, initialTransform);

    // Create animation
    const animation = gsap.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration: duration,
      ease: ease,
      delay: delay,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        threshold: threshold
      }
    });

    return () => {
      animation.kill();
    };
  }, [distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale, threshold, delay]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;
