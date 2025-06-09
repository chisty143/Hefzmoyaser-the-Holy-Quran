export function isAnyOffcanvasOpen() {
  if (typeof window === "undefined") return false;
  return document.querySelector(".offcanvas.show") !== null;
}

