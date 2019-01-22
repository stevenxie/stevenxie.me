import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faWrench, faSadCry } from "@fortawesome/free-solid-svg-icons";

// Configure fontawesome.
config.autoAddCss = false;
library.add(faWrench, faSadCry);

/** Extend Vue instance with third-party plugins. */
export function extend(Vue) {
  Vue.component("font-awesome-icon", FontAwesomeIcon);
}
