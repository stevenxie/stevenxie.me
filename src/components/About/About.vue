<template>
  <section class="about mono">
    <div class="loading" v-if="$apollo.loading">
      <loading-icon :height="50" :width="50" />
    </div>
    <pre class="data" v-else>{{ aboutText }}</pre>
    <api-status :active="!!about" />
  </section>
</template>

<script>
import gql from "graphql-tag";
import { omitMeta } from "@/utils/graphql";
import { prerendering } from "@/utils/prerender";

import APIStatus from "./APIStatus";
import LoadingIcon from "@/components/icons/LoadingIcon";

export default {
  data: () => ({
    about: null,
    error: null,
    spook: false,
  }),

  apollo: {
    // prettier-ignore
    about: {
      query: gql`
        {
          about {
            name
            type
            ... on MaskedAbout { age: approxAge }
            iq
            skills
            ... on MaskedAbout { whereabouts }
          }
        }
      `,
      skip: prerendering,
      error(err) { this.error = err; },
    }
  },

  mounted() {
    if (prerendering) return;

    // Random 1-in-5 chance of 'whereabouts' being set to "Right behind
    // you."
    const rand = Math.floor(Math.random() * Math.floor(5));
    if (!rand) this.spook = true;
    window.setTimeout(() => (this.spook = false), 3000);
  },

  computed: {
    aboutText() {
      if (this.error) return this.error;
      let { about, spook } = this;
      if (spook) about = { ...about, whereabouts: "Right behind you." };
      return JSON.stringify(omitMeta(about), undefined, 2);
    },
  },

  components: {
    "api-status": APIStatus,
    "loading-icon": LoadingIcon,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/breakpoints.scss";

.about {
  min-height: 210px;
  padding: 22px 12px 32px 12px;
  box-sizing: border-box;
  position: relative;

  color: #dedede;
  background: #2b2b2b;
  font-weight: 500;

  overflow: hidden;

  @include breakpoint(tablet) {
    width: 360px;
    height: 260px;
    border-radius: 10px;
    padding: 26px 22px 32px 22px;
    box-shadow: 0 6px 18px 0 rgba(black, 0.5);
  }

  @include breakpoint(laptop) {
    height: 300px;
    width: 400px;
    padding: 28px;
  }
}

.data {
  margin: 0;
  font-family: inherit;
  font-weight: inherit;
  font-size: 11pt;
  line-height: 15pt;
  overflow-x: auto;
  white-space: pre-wrap;

  @include breakpoint(tablet) {
    line-height: 16pt;
  }
  @include breakpoint(laptop) {
    font-size: 12pt;
    line-height: 18pt;
  }
}

.api-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

// prettier-ignore
.loading::v-deep {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

// prettier-ignore
  path { stroke: rgb(85, 85, 85) !important; }
}
</style>
