<template>
  <section class="hero flex">
    <div class="bundle flex">
      <div class="text flex">
        <h1 class="hi">Hi.</h1>
        <h2 class="intro">My name is Steven, and I build things.</h2>
      </div>
      <div v-if="$slots.default" class="embed flex"><slot /></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/styles/breakpoints.scss";

.hero {
  height: 290px;
  padding: 34px 34px 46px 34px;
  box-sizing: border-box;
  align-items: stretch;
  justify-content: stretch;

  color: white;
  background-image: linear-gradient(
    119deg,
    #3294ff 0%,
    #cb6ab7 49%,
    #eb7155 100%
  );

  @include breakpoint(tablet) {
    height: 500px;
    padding: 24px 64px 0 64px;
  }
}

.bundle {
  flex: 1;
  justify-content: flex-end;

  @include breakpoint(tablet) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  @include breakpoint(laptop) {
    align-self: center;
    width: 1000px;
  }
}

// prettier-ignore
.text {
  .hi { font-size: 56pt; }
  .intro { font-size: 17pt; }

  @include breakpoint(tablet) {
    flex: 2;
    padding-left: calc(20vw - 200px);

    > * { width: 375px; }
    .hi { font-size: 110pt; }
    .intro {
      margin-top: -12px;
      font-size: 24pt;
    }
  }

  @include breakpoint(laptop) {
    padding-left: 0;

    .hi { font-size: 136pt; }
    .intro {
      font-size: 28pt;
      margin-bottom: 14px;
    }
  }
}

.embed {
  flex: 1;
  align-items: flex-end;
  padding-right: calc(20vw - 200px);

  @include breakpoint(laptop) {
    padding-right: 0;
    margin-top: 18px;
  }
}
</style>
