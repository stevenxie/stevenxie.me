<template>
  <card class="location" v-bind="headers">
    <div class="content fullsize">
      <custom-map
        class="fullsize"
        mapstyle="mapbox://styles/stevenxie/cjxqme8sn3uwz1cnz6m83b0mi"
        :interactive="false"
      />
      <router-link to="location" target="_blank">
        <div class="overlay flex">
          <p>Click to open full map.</p>
        </div>
      </router-link>
    </div>
  </card>
</template>

<script>
import gql from "graphql-tag";
import get from "lodash/get";
import { fragments } from "@/graphql/location";
import { prerendering } from "@/utils/prerender";

import Card from "./Card";
import { Map } from "@/utils/async-modules";

export default {
  data() {
    const locationRoute = this.$router.options.routes.find(
      ({ name }) => name === "location"
    );
    return {
      region: null,
      error: null,
      locationURL: locationRoute.path,
    };
  },

  apollo: {
    // prettier-ignore
    region: { query: gql`
        {
          location { ...RegionLabel }
        }
        ${fragments.regionLabel}
      `,
      skip: prerendering,
      update: data => get(data, "location.region", null),
      error(err) { this.error = err; },
    }
  },

  computed: {
    /** @returns {{ title: string, label: string }} */
    headers() {
      const headers = {
        title: "Unknown",
        label: "Current Location",
      };
      if (this.region) headers.title = this.region.address.label;
      if (this.error) headers.error = "Failed to load location data.";
      else {
        headers.titleURL = this.locationURL;
        headers.labelURL = this.locationURL;
      }
      return headers;
    },
  },

  components: {
    card: Card,
    "custom-map": Map,
  },
};
</script>

<style lang="scss" scoped>
.fullsize {
  width: 100%;
  height: 100%;
}

// prettier-ignore
.content {
  .map { transition: filter 350ms ease-in-out; }
  &:hover .map { filter: blur(2px); }
}

// prettier-ignore
.overlay {
  position: absolute;
  top: 0; bottom: 0; right: 0; left: 0;

  align-items: center;
  justify-content: center;

  cursor: pointer;
  opacity: 0;
  transition: all 250ms ease-in-out;

  &:hover {
    opacity: 1;
    color: rgb(80, 80, 80);
    background: rgba(white, 0.3);
    font-weight: 500;
  }
}
</style>
