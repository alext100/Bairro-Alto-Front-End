import { gsap } from "gsap";
import SplitText from "@/utils/gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

const useSplitText = (cssSelector: string, animationSettings: string) => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(SplitText);

  setTimeout(() => {
    const splitTimeline = gsap.timeline();

    const SplitTextByCSSSelector = new SplitText(cssSelector, { type: "words,chars" });
    const { chars } = SplitTextByCSSSelector;

    let settings: Record<string, unknown>;
    const charsWave = {
      duration: 1,
      opacity: 0,
      scale: 0,
      y: 80,
      rotationX: 200,
      transformOrigin: "0% 50% -50",
      ease: "back",
      stagger: 0.01,
    };
    const staggerFromEnd = {
      opacity: 0,
      y: 50,
      ease: "back(4)",
      stagger: {
        from: "end", // "center", "edges"
        each: 0.05,
      },
    };

    switch (animationSettings) {
      case "ChartsWave":
        settings = charsWave;
        break;

      case "staggerFromEnd":
        settings = staggerFromEnd;
        break;

      default:
        settings = charsWave;
        break;
    }

    splitTimeline.from(chars, settings, "+=0");
  });
};

export default useSplitText;
