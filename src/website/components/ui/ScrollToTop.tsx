import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  // Le decimos al navegador que NO restaure el scroll por su cuenta al
  // recargar — sin esto, el navegador puede "pisar" el scrollTo(0,0) de
  // abajo con la posición que tenía guardada antes del F5.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;