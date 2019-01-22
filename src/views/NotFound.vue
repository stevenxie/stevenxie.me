<template>
  <div class="not-found flex col">
    <font-awesome-icon class="icon" icon="sad-cry" size="5x" />
    <h1>404 not found</h1>
    <p><i>couldn't find that page you were lookin' for</i></p>
    <p class="emph">
      maybe let's just
      <router-link to="/">go back home?</router-link>
    </p>
  </div>
</template>

<script>
export default {
  head: { title: "404 • Steven Xie" },
};
</script>

<style lang="scss" scoped>
$primary: rgb(66, 66, 66);
$secondary: white;

.not-found {
  position: absolute;
  align-items: center;
  justify-content: center;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  color: $primary;
}

h1 {
  padding: 5px;
  margin-bottom: 20px;
  font-family: "Ubuntu Mono", monospace;

  background-color: $primary;
  color: $secondary;

  @keyframes blink {
    // prettier-ignore
    from { background-color: $primary; }
    // prettier-ignore
    to { background-color: rgb(236, 81, 81); }
  }
  animation: blink 1.25s infinite alternate;
}

svg.icon {
  margin-bottom: 30px;
}

p {
  margin: 3px 0;

  &.emph {
    margin-top: 10px;
    font-weight: 500;
  }
}

a {
  font-weight: 700;

  color: black;
  transition: opacity 200ms ease-in-out;

  // prettier-ignore
  &:hover { opacity: 0.6; }
}
</style>
