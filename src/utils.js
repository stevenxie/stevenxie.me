export const prerendering = !!window.__PRERENDER_INJECTED;
export const prerendered = window.__PRERENDERED;

export function injectPrerenderedTag() {
  const script = document.createElement(`script`);
  script.type = "text/javascript";
  script.innerHTML = `window.__PRERENDERED = true;`;
  document.head.appendChild(script);
}
