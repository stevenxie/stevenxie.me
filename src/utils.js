export function isPrerendering() {
  return !!window.__PRERENDER_INJECTED;
}

export function injectPrerenderedTag() {
  const script = document.createElement(`script`);
  script.type = "text/javascript";
  script.innerHTML = `window.__PRERENDERED = true;`;
  document.head.appendChild(script);
}
