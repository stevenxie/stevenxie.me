<template>
  <div class="cz flex col">
    <div id="f" :class="{ started: startTime }" />
    <button v-if="!startTime" @click="start">
      clinical depression
    </button>
  </div>
</template>

<script>
function buildMaterial() {
  const { LiquidDistortMaterial } = window.Blotter;
  const mat = new LiquidDistortMaterial();

  // Configure material uniforms.
  const { uniforms } = mat;
  uniforms.uSpeed.value = 0.255555;
  uniforms.uVolatility.value = 0.05;
  uniforms.uSeed.value = 1.15;

  return mat;
}

export default {
  head: {
    title: "RIP CZ",
    // prettier-ignore
    script: [
      { src: "https://cdnjs.cloudflare.com/ajax/libs/Blotter/0.1.0/blotter.min.js" },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/Blotter/0.1.0/materials/liquidDistortMaterial.min.js" },
    ]
  },
  data: () => ({ startTime: null, material: null }),
  methods: {
    /** Initializes the 'F', and starts music. */
    start() {
      this.startTime = new Date();

      // Build and insert animated 'F'.
      const { Text } = window.Blotter;
      const text = new Text("F", {
        family: "Comic Sans MS",
        size: 150,
        fill: "rgb(218, 218, 218)",
      });
      this.material = buildMaterial();
      const blotter = new window.Blotter(this.material, { texts: text });
      const scope = blotter.forText(text);
      scope.appendTo(document.getElementById("f"));

      // Start the music.
      const audio = new Audio("./cz-titanic.mp3");
      audio.play();

      // Begin surrealification process after 5 second.
      setTimeout(this.surrealify, 5000);
    },

    /** Makes the 'F' more... surreal-lookin'. */
    surrealify() {
      const { startTime, material } = this;
      const secondsSinceStart = parseInt(new Date() - startTime) / 1000;
      if (secondsSinceStart > 30) return; // stop 30 seconds after start
      material.uniforms.uVolatility.value += 0.01;
      setTimeout(this.surrealify, 1000); // repeat
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/fonts.scss";

// prettier-ignore
.cz {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  align-items: center;
  justify-content: center;

  background-color: rgb(24, 24, 24);
}

#f {
  opacity: 0;

  &.started {
    // prettier-ignore
    @keyframes transition {
      0% { opacity: 0; }
      18% { opacity: 0.25; }
      38% { opacity: 1; }
      90% { opacity: 1; }
      100% { opacity: 0; }
    }
    animation: transition 32s;
  }
}

button {
  font-family: $sans;
  font-size: 15pt;
}
</style>
