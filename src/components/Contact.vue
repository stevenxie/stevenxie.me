<template>
  <div class="contact flex">
    <img class="avatar" src="@/assets/ori.svg" />
    <h2 class="chat">Wanna chat?</h2>
    <p class="message">Shoot me a message at</p>
    <span class="email-wrapper" :class="{ error }">
      <a class="mailtoui" :href="mailtoURL">
        <div class="email mono flex">
          <loading-icon :width="20" v-if="loading" />
          <span v-else-if="email">{{ email }}</span>
          <div class="error" v-else>
            <alert-icon :width="30" :height="33" />
            <p class="text">email fetch error</p>
          </div>
        </div>
      </a>
    </span>
  </div>
</template>

<script>
import { isPrerendering } from "@/utils";
import { mapGetters, mapState } from "vuex";
import { FETCH_ABOUT } from "@/store/actions";
import { ABOUT_EMAIL } from "@/store/getters";

import AlertIcon from "@/components/icons/AlertIcon";
import LoadingIcon from "@/components/icons/LoadingIcon";

export default {
  created() {
    if (isPrerendering()) return; // do not fetch during prerender
    this.$store.dispatch(FETCH_ABOUT);
  },
  computed: {
    ...mapState({ loading: "aboutLoading", error: "aboutError" }),
    ...mapGetters({ email: ABOUT_EMAIL }),
    mailtoURL() {
      return this.email && `mailto:${this.email}?subject=Hello!`;
    },
  },
  components: { "alert-icon": AlertIcon, "loading-icon": LoadingIcon },
};
</script>

<style lang="scss" scoped>
.contact {
  padding: 28px 0 34px 0;
  align-items: center;
  background-image: linear-gradient(180deg, #cadae6 37%, #b9c8d0 100%);
}

.avatar {
  height: 56px;
  margin: 0 0 6px 0;
}

.chat {
  font-size: 15pt;
  font-weight: 600;
  color: #454545;
}

.message {
  font-size: 13pt;
  color: #454545;
}

.email {
  $background: #ebf5fa;

  min-width: 100px;
  margin-top: 12px;
  padding: 9px 15px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;

  font-weight: 500;
  background: $background;
  color: #225cec;

  transition: background 200ms ease-in-out;
  &:hover {
    background: lighten($background, 4%);
  }

  .loading::v-deep path {
    stroke: rgb(89, 98, 110) !important;
  }

  .error {
    display: flex;
    align-items: center;

    .text {
      margin-left: 5px;
      color: #415863;
    }
  }
}

.email-wrapper {
  // prettier-ignore
  &.error { pointer-events: none; }

  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>
