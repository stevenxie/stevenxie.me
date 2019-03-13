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

// prettier-ignore
.home {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}

// prettier-ignore
.navbar { align-self: flex-end; }

.intro {
  align-items: center;

  .title {
    padding: 5px;
    margin-bottom: 20px;

    background-color: $primary;
    color: $secondary;
  }
}

.construction {
  flex: 1;
  margin-bottom: 65px;
}
</style>
