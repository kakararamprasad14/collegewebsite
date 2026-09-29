/**
 * Router Module - Client-Side Hash Router
 * Supports 8 primary destinations with active state synchronization and accessibility focus management
 */

export class Router {
  constructor(routes, defaultRoute = "home") {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    this.currentRoute = null;
    this.subscribers = [];

    this.init();
  }

  init() {
    window.addEventListener("hashchange", () => this.handleRouteChange());
    // Initial route handling
    this.handleRouteChange();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify(route, params) {
    this.subscribers.forEach(cb => cb(route, params));
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, "").trim();
    if (!hash) return { route: this.defaultRoute, param: null };
    
    // Support sub-params like #exams/results
    const parts = hash.split("/");
    const route = parts[0].toLowerCase();
    const param = parts[1] || null;

    if (this.routes.includes(route)) {
      return { route, param };
    }
    return { route: this.defaultRoute, param: null };
  }

  handleRouteChange() {
    const { route, param } = this.getRouteFromHash();
    this.currentRoute = route;

    // Update active nav indicators across desktop and mobile
    this.updateNavIndicators(route);

    // Update page title
    const formattedTitle = route.charAt(0).toUpperCase() + route.slice(1);
    document.title = `${formattedTitle} | Student Hub - College Digital Portal`;

    // Notify listeners to render view
    this.notify(route, param);

    // Accessible focus management: scroll to top and focus main landmark
    const mainEl = document.getElementById("main-content");
    if (mainEl) {
      mainEl.setAttribute("tabindex", "-1");
      mainEl.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  updateNavIndicators(activeRoute) {
    // Desktop Nav Items
    document.querySelectorAll(".nav-item-link").forEach(link => {
      const linkRoute = link.getAttribute("data-route");
      if (linkRoute === activeRoute) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });

    // Mobile Bottom Nav Items
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      const btnRoute = btn.getAttribute("data-route");
      if (btnRoute === activeRoute) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
      } else {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
      }
    });
  }

  navigate(route) {
    window.location.hash = `#${route}`;
  }
}
