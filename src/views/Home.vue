<template>
  <div class="home flex col">
    <navbar />
    <construction class="under-construction" />
  </div>
</template>

<script>
import Construction from "@/components/Construction.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  head: { title: "Home • Steven Xie" },
  components: {
    construction: Construction,
    navbar: NavBar,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

$primary: rgb(66, 66, 66);
$secondary: white;

.navbar {
  align-self: flex-end;
}

.intro {
  align-items: center;

  .title {
    padding: 5px;
    margin-bottom: 20px;

    background-color: $primary;
    color: $secondary;
  }
}
</style>
