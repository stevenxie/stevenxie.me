<template>
  <div class="hero flex">
    <div class="bundle flex">
      <div class="text">
        <h1 class="hi">Hi.</h1>
        <h2 class="intro">My name is Steven, and I build things.</h2>
      </div>
      <div v-if="$slots.default" class="embed"><slot /></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.hero {
  height: 290px;
  align-items: center;

  color: white;
  background-image: linear-gradient(
    119deg,
    #3294ff 0%,
    #cb6ab7 49%,
    #eb7155 100%
  );

  @include breakpoint(tablet) {
    height: 500px;
  }
}

.bundle {
  width: 100%;
  height: 100%;
  padding: 34px 34px 46px 34px;
  box-sizing: border-box;
  justify-content: flex-end;
  box-sizing: border-box;

  @include breakpoint(tablet) {
    max-width: calc(10vw + 800px);
    padding: 32px 64px 0 64px;
    align-self: center;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  @include breakpoint(laptop) {
    width: calc(60vw + 185px);
    max-width: 1300px;
  }
}

.text {
  .hi {
    margin-top: 22px;
    font-size: 56pt;
  }

  .intro {
    margin-top: 4px;
    font-size: 17pt;
  }

  @include breakpoint(tablet) {
    flex: 1;

    // prettier-ignore
    .hi { font-size: 110pt; }
    .intro {
      width: calc(10vw + 250px);
      max-width: 400px;
      font-size: 24pt;
    }
  }
}

.embed {
  height: 275px;
  margin-right: 1vw;
  display: flex;
  align-items: stretch;
}
</style>
