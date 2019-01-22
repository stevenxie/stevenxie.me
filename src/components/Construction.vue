<template>
  <div class="construction flex col">
    <div class="links flex">
      <p v-for="link in links" :key="link.url" :class="link.class">
        <a :href="link.url">{{ link.name }}</a>
      </p>
    </div>

    <font-awesome-icon class="icon" icon="wrench" size="5x" />
    <h1>hello, world!</h1>
    <p class="emph">this website is under heavy construction.</p>
    <p><i>wanna try again in like a week or so?</i></p>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      links: [
        { name: "status", url: "https://status.stevenxie.me" },
        { name: "resume", url: "/resume/", class: "desktop-only" },
        { name: "github", url: "https://github.com/stevenxie" },
      ],
    };
  },
};
</script>

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

div.links {
  position: absolute;
  top: 15px;
  right: 15px;

  @include breakpoint(phablet) {
    top: 25px;
    right: 25px;
  }

  p {
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
  }

  .desktop-only {
    display: none;

    @include breakpoint(tablet) {
      display: block;
    }
  }
}

h1 {
  padding: 5px;
  margin-bottom: 20px;
  font-family: "Ubuntu Mono", monospace;

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
