<template>
  <div class="location flex">
    <custom-map :show-controls="true" :zoom="12" />
    <div class="panel flex">
      <span v-if="location">
        <div class="group">
          <h1 class="label">Approx. Location</h1>
          <p class="value">{{ location.address.label }}</p>
        </div>
        <div class="group">
          <h1 class="label">Detailed Location</h1>
          <div class="passcode">
            <input
              class="input mono"
              type="text"
              placeholder="access code"
              disabled
            />
            <lock-icon :height="22" :locked="locked" />
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { prerendering } from "@/utils";
import { FETCH_LOCATION } from "@/store/actions";

import Map from "@/components/Map";
import LockIcon from "@/components/icons/LockIcon";

export default {
  data: () => ({ locked: true }),

  mounted() {
    if (prerendering) return;
    if (!this.location && !this.loading) this.$store.dispatch(FETCH_LOCATION);
  },

  computed: {
    ...mapState({
      location: "location",
      loading: "locationLoading",
      error: "locationError",
    }),
  },

  components: {
    "custom-map": Map,
    "lock-icon": LockIcon,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

// prettier-ignore
.location {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
}

// prettier-ignore
.map { flex: 1; }

// prettier-ignore
.panel {
  $offset: 25px;

  position: absolute;
  z-index: 1;
  bottom: $offset; right: $offset;
  width: 275px;
  min-height: 110px;
  border-radius: 5px;
  padding: 15px 18px;

  background: white;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.50);

  @include breakpoint(mobileonly) {
    position: relative;
    bottom: unset; right: unset;
    width: unset;
    border-radius: 0;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
  }
}

.group {
  // prettier-ignore
  &:not(:first-of-type) { margin-top: 16px; }

  .label {
    margin-bottom: 4px;
    font-size: 10pt;
    font-weight: 500;
    color: #8b8b8b;
  }

  .value {
    font-size: 16pt;
    font-weight: 700;
    color: #404040;

    // Overflow into ellipses.
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .passcode {
    position: relative;

    .input {
      $background: #d6d6d6;

      width: 100%;
      padding: 8px 10px;
      border: none;
      border-radius: 6px;
      box-sizing: border-box;

      font-size: 12pt;
      font-weight: 500;
      background: $background;
      transition: background 250ms ease-in-out;

      // prettier-ignore
      &:not(:disabled) {
        &:hover, &:focus { background: lighten($background, 2%); }
      }
      &:disabled {
        cursor: not-allowed;
      }
    }

    // prettier-ignore
    .lock-icon::v-deep {
      $offset: 6px;
      position: absolute;
      top: $offset; right: $offset; bottom: $offset;

      svg path { stroke: rgb(69, 69, 69); }
    }
  }
}
</style>
