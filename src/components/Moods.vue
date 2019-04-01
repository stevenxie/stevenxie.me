<template>
  <div class="moods">
    <pre>
      {{ moods }}
    </pre>
  </div>
</template>

<script>
import { sharedMoodService as moodService } from "@/services/MoodService";

export default {
  data: () => ({ moods: [] }),
  async created() {
    if (!process.browser) return;
    try {
      this.moods = await moodService.getMoods(100);
    } catch (err) {
      alert(`Something went wrong: ${JSON.stringify(err)}`);
    }
  },
};
</script>
