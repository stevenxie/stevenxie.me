<template>
  <client-only class="no-prerender" v-if="visible">
    <slot />
  </client-only>
</template>

<script>
import ClientOnly from "vue-client-only";
import { prerendering } from "@/utils/prerender";

// prettier-ignore
export default {
  data: () => ({ visible: false }) ,
  mounted() { if (!prerendering) this.visible = true; },
  components: { "client-only": ClientOnly }
}
</script>
