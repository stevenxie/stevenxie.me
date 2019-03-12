<template>
  <div class="construction flex col">
    <font-awesome-icon class="icon" icon="wrench" size="5x" />
    <h1>hello, world!</h1>
    <p class="emph">this rest of this website is under construction.</p>
    <p><i>wanna check back in like a week or so?</i></p>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

$primary: rgb(66, 66, 66);
$secondary: white;

.construction {
  position: absolute;
  align-items: center;
  justify-content: center;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  color: $primary;
}

h1 {
  padding: 5px;
  margin-bottom: 20px;

  background-color: $primary;
  color: $secondary;
}

svg.icon {
  margin-bottom: 30px;
}

p {
  margin: 3px 0;

  // prettier-ignore
  &.emph { font-weight: 500; }
}
</style>
