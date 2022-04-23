import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import * as filters from "pixi-filters";
import { GlitchFilterOptions } from "pixi-filters";
import { computed, ComputedRef, onUnmounted, Ref, ref } from "vue";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function usePixiGlitchFilter(
  querySelectorOfImageToReplace: string,
  htmlStringWithImageToParse: string,
  cardCoverImageSrcAttribute: string
) {
  if (!PIXI.utils.isMobile.any) {
    const parser = new DOMParser();
    const documentOfParsedPostBody: Document = parser.parseFromString(htmlStringWithImageToParse, "text/html");
    const cardCoverImage: HTMLElement | null = documentOfParsedPostBody.querySelector(querySelectorOfImageToReplace);
    const imageToReplace: ComputedRef<HTMLElement> = computed(
      () => document.body.querySelector(querySelectorOfImageToReplace) as HTMLElement
    );

    const cardContainer: Ref<HTMLElement | undefined> = ref<HTMLElement>();
    const app: PIXI.Application = new PIXI.Application({
      resizeTo: cardContainer.value,
      backgroundAlpha: 0,
    });
    const container = new PIXI.Container();
    app.stage.addChild(container);

    queueMicrotask(() => {
      if (imageToReplace.value && cardCoverImage) {
        const spriteImage = `${cardCoverImage?.getAttribute(cardCoverImageSrcAttribute)}`;
        if (cardCoverImageSrcAttribute === "src") {
          const pixiSprite = PIXI.Sprite.from(spriteImage);
          container.addChild(pixiSprite);
        }
        if (cardCoverImageSrcAttribute === "srcset") {
          const pixiSprite = PIXI.Sprite.from(spriteImage.split(" ")[0]);
          container.addChild(pixiSprite);
        }

        imageToReplace.value.replaceWith(app.view);
      }
    });

    const filterOptions: Pick<GlitchFilterOptions, "slices"> = { slices: 200 };
    const filter = new filters.GlitchFilter(filterOptions as any);

    container.filters = [filter] as any;

    gsap.fromTo(
      filter,
      {
        offset: 0,
      },
      {
        offset: 1000,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
        repeatDelay: 1,
      }
    );
    gsap.fromTo(
      filter,
      {
        direction: 0,
      },
      {
        direction: 360,
        duration: 30,
        ease: "none",
        repeat: 1,
      }
    );

    const updateSize = (): void => {
      container.x = -100;
      container.y = 0;
      if (window.innerWidth < 1000) {
        container.x = -150;
      }
      if (window.innerWidth < 800) {
        container.x = -200;
      }
      if (window.innerWidth < 700) {
        container.x = -300;
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    onUnmounted(() => {
      window.removeEventListener("resize", updateSize);
    });
  }
}
