<template>
  <card
    class="commits flex"
    title="Recent Commits"
    titleURL="https://github.com/stevenxie"
    label="GitHub"
    labelURL="https://github.com"
    :error="errorMessage"
  >
    <div class="container">
      <div
        class="commit-card"
        v-for="{ repo, sha, timestamp, url } in firstThreeCommits"
        :key="sha"
      >
        <h3 class="title mono">
          <a :href="repo.url" target="_blank">{{ repo.name }}</a>
        </h3>
        <p class="label mono">
          <a :href="url" target="_blank">{{ sha.substr(0, 7) }}</a>
        </p>
        <h5 class="timestamp">{{ parseAndFormat(timestamp) }}</h5>
      </div>
      <span class="skeletons" v-if="loading">
        <content-loader
          class="skeleton"
          primary-color="#edeaea"
          secondary-color="#c6c6c6"
          :height="115"
          v-for="i in 3"
          :key="i"
        />
      </span>
    </div>
  </card>
</template>

<script>
import take from "lodash/take";
import parse from "date-fns/parse";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { ContentLoader } from "vue-content-loader";

import { prerendering } from "@/utils";
import { mapState } from "vuex";
import { FETCH_COMMITS } from "@/store/actions";

import Card from "./Card";

export default {
  mounted() {
    if (prerendering) return; // do not fetch during prerender
    this.$store.dispatch(FETCH_COMMITS);
  },
  computed: {
    ...mapState({
      commits: "commits",
      loading: "commitsLoading",
      error: "commitsError",
    }),
    firstThreeCommits() {
      return take(this.commits, 3);
    },
    errorMessage() {
      return this.error && "Failed to load recent commits.";
    },
  },
  methods: {
    /**
     * @param {string} datestr
     * @returns {string}
     */
    parseAndFormat(datestr) {
      const words = distanceInWordsToNow(parse(datestr), {
        addSuffix: true,
      });
      return words.replace("about", "~").replace("less than", "<");
    },
  },
  components: { card: Card, "content-loader": ContentLoader },
};
</script>

<style lang="scss" scoped>
.commit-card {
  margin: 2px 2px 8px 2px;
  border-radius: 4px;
  padding: 8px 12px 16px 12px;
  position: relative;

  color: white;
  background: #848e94;
  box-shadow: 0 2px 4px 0 rgba(black, 0.5);

  &:first-child {
    background-image: linear-gradient(135deg, #4e8cf1 0%, #29bc9a 100%);
  }

  transition: all 200ms ease-in-out;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px 0 rgba(black, 0.5);
  }

  .title {
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    font-size: 12pt;

    transition: color 200ms ease-in-out;
    &:hover {
      color: rgba(white, 0.85);
    }
  }

  .label {
    font-size: 11pt;
    color: rgba(white, 0.85);

    transition: color 200ms ease-in-out;
    &:hover {
      color: rgba(white, 0.6);
    }
  }

  // prettier-ignore
  .timestamp {
    position: absolute;
    right: 6px; bottom: 3px;

    font-weight: 600;
    font-size: 10pt;
    color: rgba(white, 0.7);
  }
}

.skeleton {
  margin: 2px 2px 4px 2px;
  border-radius: 4px;
}
</style>
