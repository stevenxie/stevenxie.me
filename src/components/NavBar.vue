<template>
  <div class="navbar flex">
    <p v-for="link in links" :key="link.url" class="item" :class="link.class">
      <a :href="link.url">{{ link.name }}</a>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    links: [
      // { name: "status", url: "https://status.stevenxie.me" },
      { name: "resume", url: "/resume/", class: "desktop-only" },
      { name: "github", url: "https://github.com/stevenxie" },
    ],
  }),
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

$primary: rgb(66, 66, 66);
$secondary: white;

.navbar {
  margin: 15px;
  color: $primary;

  @include breakpoint(phablet) {
    margin: 25px;
  }

  .item {
    margin: 0 5px;
    padding: 4px 6px;
    border-radius: 6px;

    font-weight: 600;
    background-color: rgb(187, 187, 187);
    cursor: pointer;

    transition: background 200ms ease-in-out;

    &:hover {
      background-color: rgb(155, 155, 155);
    }

    a {
      text-decoration: none;
      outline: none;
      color: $secondary;
    }

    &.desktop-only {
      display: none;

      @include breakpoint(tablet) {
        display: block;
      }
    }
  }
}
</style>
