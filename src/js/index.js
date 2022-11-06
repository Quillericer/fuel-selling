/**
 * Get scroll values for page or an element.
 *
 * Scroll values is the scroll offset from the given side.
 * Scroll dimensions is the size of all of the box's content, including
 * the parts that are currently hidden outside the scrolling area.
 *
 * NB: if the element has no associated CSS layout box
 * or if the CSS layout box is inline, scroll dimensions will be zero.
 *
 * ![SA#21064101 answer](https://i.stack.imgur.com/5AAyW.png)
 * @param {?HTMLElement} el Element.
 */
function getScroll(el = null) {
  if (el)
    return {
      top: el.scrollTop || 0,
      left: el.scrollLeft || 0,
      height: el.scrollHeight || 0,
      width: el.scrollWidth || 0,
    }
  return {
    top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
    left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    height: document.documentElement.scrollHeight || document.body.scrollHeight || 0,
    width: document.documentElement.scrollWidth || document.body.scrollWidth || 0,
  }
}

/**
 * Get offset values for an element.
 * Offset values is the offset to the given side (taking into account margin)
 * from the closest relatively positioned parent element.
 * Offset __dimensions__ is the size of the visual box including all borders (but
 * __excluding margin__).
 *
 * ![SA#21064101 answer](https://i.stack.imgur.com/5AAyW.png)
 * @param {HTMLElement} el Element.
 */
function getOffset(el) {
  return {
    top: el.offsetTop || 0,
    left: el.offsetLeft || 0,
    height: el.offsetHeight || 0,
    width: el.offsetWidth || 0,
  }
}

/**
 * Get client values for an element.
 * Client values is the size of border and scrollbar (if present).
 * Client dimensions is the visual portion of the box content,
 * not including borders or scrollbars, but includes padding.
 *
 * NB: if the element has no associated CSS layout box
 * or if the CSS layout box is inline, client dimensions will be zero.
 *
 * ![SA#21064101 answer](https://i.stack.imgur.com/5AAyW.png)
 * @param {HTMLElement} el Element.
 */
function getClient(el) {
  return {
    top: el.clientTop || 0,
    left: el.clientLeft || 0,
    height: el.clientHeight || 0,
    width: el.clientWidth || 0,
  }
}


class Slider {
  /** @type {HTMLElement} */
  slider;
  /** @type {HTMLElement} */
  next;
  /** @type {HTMLElement} */
  previus;

  /** @type {HTMLElement[]} */
  slides;

  transitionDuration = 1000;

  scrollAnimeController = new AnimationController(
    AnimationController.easeInOutCubic
  );

  /**
   * @param {HTMLElement} slider
   * @param {HTMLElement} next
   * @param {HTMLElement} previus
   */
  constructor(slider, next, previus) {
    this.slider = slider;
    this.slides = Array.from(this.slider.querySelectorAll(".slider__child"));
    this.next = next;
    this.previus = previus;
    this.next.addEventListener("click", this.onNextClick.bind(this));
    this.previus.addEventListener("click", this.onPreviusClick.bind(this));
  }

  get currentElement() {
    const currentScroll = this.scrollAnimeController.isAnimating
      ? this.scrollAnimeController.animatingTo
      : this.slider.scrollLeft;
    for (const slide of this.slides) {
      const left = getOffset(slide).left;
      if (left >= currentScroll) return slide;
    }
    throw new Error("Bad state");
  }

  get nextElement() {
    const currentIdx = this.slides.indexOf(this.currentElement);
    const next = this.slides[currentIdx + 1];
    return next ? next : null;
  }

  get previousElement() {
    const currentIdx = this.slides.indexOf(this.currentElement);
    const next = this.slides[currentIdx - 1];
    return next ? next : null;
  }

  scrollTo(to) {
    const { slider, } = this;
    this.scrollAnimeController.animate(
      (value) => (slider.scrollLeft = value),
      slider.scrollLeft,
      to,
      this.transitionDuration
    );
  }

  /** @param {MouseEvent} event */
  onNextClick(event) {
    const { nextElement, slider } = this;
    if (nextElement) {
      this.scrollTo(getOffset(nextElement).left);
    }
  }

  /** @param {MouseEvent} event */
  onPreviusClick(event) {
    const { previousElement } = this;
    if (previousElement) {
      this.scrollTo(getOffset(previousElement).left);
    }
  }
}

class AnimationController {
  /** @type {function|null} */
  cancel = null;

  /** @type {function} */
  easeFunction;

  /** @type {number|null} */
  animatingTo = null;

  constructor(easeFunction) {
    this.easeFunction = easeFunction;
  }

  get isAnimating() {
    return this.animatingTo != null;
  }

  animate(setFunction, from, to, duration) {
    if (this.cancel) this.cancel();
    this.animatingTo = to;
    return (this.cancel = AnimationController.animate(
      (percent) => {
        if (percent == 1) {
          this.animatingTo = null;
          this.cancel = null;
        }
        setFunction(from + (to - from) * percent);
      },
      this.easeFunction,
      duration
    ));
  }

  /** @param {number} x */
  static easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  static animate(setCallabck, easeFunction, duration) {
    const begin = Date.now();
    const end = begin + duration;

    let timeoutMarker;
    let tickMarker;
    let flushed = false;

    const endAnimation = () => {
      clearTimeout(timeoutMarker);
      window.cancelAnimationFrame(tickMarker);
      if (!flushed) {
        setCallabck(1);
        flushed = true;
      }
    };

    const tick = () => {
      const now = Date.now();
      if (now >= end) {
        return endAnimation();
      }

      if (!flushed) {
        setCallabck(easeFunction((now - begin) / duration));

        tickMarker = window.requestAnimationFrame(tick);
      }
    };

    timeoutMarker = setTimeout(endAnimation, duration);

    window.requestAnimationFrame(tick);
    return endAnimation;
  }
}


const certSlider = new Slider(
  document.querySelector(".certificates-list"),
  document.querySelector(".certificates-list__next"),
  document.querySelector(".certificates-list__previous")
);

const reviewSlider = new Slider(
  document.querySelector(".review__wrapper"),
  document.querySelector(".review__button-next"),
  document.querySelector(".review__button-prev")
);
