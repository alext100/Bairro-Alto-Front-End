/* eslint-disable no-unused-expressions */
import { gsap } from "gsap";
import * as PIXI from "pixi.js";
import * as filters from "pixi-filters";
import { GlitchFilterOptions } from "pixi-filters";
import { computed, ComputedRef, onUnmounted } from "vue";

const getImageDimensions = async (imageUrl: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const image = new Image();
    image.src = imageUrl;
    let dimensiones = { width: 800, height: 600 };
    image.onload = () => {
      dimensiones = {
        width: image.width,
        height: image.height,
      };
      resolve(dimensiones);
    };
  });

const updateSize = (): void => {
  const canvas: HTMLCanvasElement | null = document.body.querySelector("canvas");

  if (canvas && window.innerWidth < 1100) {
    canvas?.setAttribute("style", "max-width: 850px");
  }
  if (canvas && window.innerWidth < 992) {
    canvas?.setAttribute("style", "width: 630px");
  }
  if (canvas && window.innerWidth < 768) {
    canvas?.setAttribute("style", "width: 450px");
  }
  if (canvas && window.innerWidth < 600) {
    canvas?.setAttribute("style", "width: 400px");
  }
  if (canvas && window.innerWidth < 500) {
    canvas?.setAttribute("style", "width: 300px");
  }
  window.addEventListener("resize", updateSize);
};

const usePixiGlitchFilter = (
  querySelectorOfImageToReplace: string,
  htmlStringWithImage: string,
  cardCoverImageSrc: string
) => {
  if (!PIXI.utils.isMobile.any) {
    updateSize();
    const parser = new DOMParser();
    const documentOfParsedPostBody: Document = parser.parseFromString(htmlStringWithImage, "text/html");
    const cardCoverImage: HTMLElement | null = documentOfParsedPostBody.querySelector(querySelectorOfImageToReplace);
    const imageToReplace: ComputedRef<HTMLElement> = computed(
      () => document.body.querySelector(querySelectorOfImageToReplace) as HTMLElement
    );

    let app: PIXI.Application;
    let container: PIXI.Container;
    let filter: PIXI.Filter;

    if (cardCoverImage) {
      queueMicrotask(async () => {
        const srcUrlImageToReplace = imageToReplace.value.getAttribute(cardCoverImageSrc)?.split(" ")[0] as string;
        const { width, height } = await getImageDimensions(srcUrlImageToReplace);

        app = new PIXI.Application({
          width: width < 880 ? width : 880,
          height,
          backgroundAlpha: 0,
          autoDensity: true,
        });

        container = new PIXI.Container();
        app.stage.addChild(container);

        const filterOptions: Pick<GlitchFilterOptions, "slices"> = { slices: 200 };
        filter = new filters.GlitchFilter(filterOptions);
        container.filters = [filter];

        if (imageToReplace.value) {
          const spriteImageUrl = `${cardCoverImage?.getAttribute(cardCoverImageSrc)}`;
          if (cardCoverImageSrc === "src") {
            const pixiSprite = PIXI.Sprite.from(spriteImageUrl);
            container.addChild(pixiSprite);
          }
          if (cardCoverImageSrc === "srcset") {
            const pixiSprite = PIXI.Sprite.from(spriteImageUrl.split(" ")[0]);
            container.addChild(pixiSprite);
          }
          imageToReplace.value.replaceWith(app.view);
        }

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
      });
    }
  }
  onUnmounted(() => {
    window.removeEventListener("resize", updateSize);
  });
};

export default usePixiGlitchFilter;
