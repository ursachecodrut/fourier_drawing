import SVGO from "./svgoCustom/lib/svgo.js";

const svgo = new SVGO();

export function optimiseSvg(svgstr) {
  return svgo
    .optimize(svgstr)
    .then((val) => val.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
}

export function removeCanvas(id) {
  let el = document.getElementById(id);
  el.parentNode.removeChild(el);
}

export function addScrollEvenListener(EL) {
  //Add event listener to log canvas, only animate when in viewbox.
  window.addEventListener("scroll", () => {
    //Everytime you scroll set new timeout ID, so dont make costly callback calls.
    if (EL.timeoutID) {
      window.clearTimeout(EL.timeoutID);
    }
    EL.timeoutID = window.setTimeout(function () {
      if (elementInView(EL)) {
        //Should make loop executing, if not already true.
        updateManySketch(true, EL);
      } else {
        //Should stop loop executing if not already the case.
        updateManySketch(false, EL);
      }
    }, 500);
  });
}

function elementInView(EL) {
  const boundingRect = EL.sketchP5.canvas.getBoundingClientRect();
  return (
    boundingRect.bottom >= 0 &&
    boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    boundingRect.right >= 0 &&
    boundingRect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function updateManySketch(inFrame, EL) {
  if (inFrame) {
    //Want to make canvas loop, if it isn't doing so already.
    if (!EL.sketchP5.isLooping()) {
      EL.sketchP5.loop();
    }
  } else {
    //Stop the drawing, as not in frame.
    if (EL.sketchP5.isLooping()) {
      EL.sketchP5.noLoop();
    }
  }
}

export function cacheHasItem(key) {
  return true ? localStorage.getItem(key) !== null : false;
}

export function writeToStorage(key, arrx, arry) {
  if (cacheHasItem(key)) {
    throw new Error("Error, cache entry already exists for " + key);
  } else {
    localStorage.setItem(key, JSON.stringify({ fourierX: arrx, fourierY: arry }));
  }
}

export function getFromStorage(key) {
  if (!cacheHasItem(key)) {
    throw new Error("Error, key not found in cache.");
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
}
