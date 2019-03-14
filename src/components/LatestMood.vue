<template>
  <div class="latest-moods flex col">
    <h2>How's this heckin' boy doin' today?</h2>
    <div class="block">
      <h4 class="title">Last mood record:</h4>
      <pre v-if="latestMood">{{ latestMoodText }}</pre>
      <p class="loading" v-else>Loading...</p>
    </div>
    <div class="bottom" v-if="latestMood">
      <p class="timestamp">
        Last entry from
        <span class="time">{{ timeSinceLatestMood }}</span>
        .
      </p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { sharedMoodService as moodService } from "@/services/MoodService";

export default {
  data: () => ({ moods: [] }),
  async created() {
    if (!process.browser) return; // only run in browser
    try {
      this.moods = await moodService.getMoods(1);
    } catch (err) {
      alert(`Something went wrong: ${JSON.stringify(err)}`);
    }
  },
  computed: {
    latestMood() {
      const [mood = null] = this.moods;
      return mood;
    },
    latestMoodText() {
      const { latestMood } = this;
      return JSON.stringify(latestMood, undefined, 2);
    },
    timeSinceLatestMood() {
      const { latestMood } = this;
      if (!latestMood) return "?";

      const { timestamp } = latestMood;
      return moment(timestamp).fromNow();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/fonts.scss";

.latest-moods {
  align-items: center;
}

h2 {
  margin: 1em 0;
  font-family: $sans;
  // font-style: oblique;
}

.block {
  background-color: rgb(235, 235, 235);
  min-width: 18em;
  min-height: 14.5em;
  padding: 1.25em;
  border-radius: 0.2em;

  .title {
    font-weight: 600;
    font-family: $sans;
  }

  .loading {
    margin-top: 13px;
    font-size: 11pt;
    font-style: oblique;
  }
}

.bottom {
  margin-top: 1.5em;

  .timestamp {
    font-style: oblique;

    .time {
      font-weight: 600;
      color: rgb(36, 36, 36);
    }
  }
}
</style>
