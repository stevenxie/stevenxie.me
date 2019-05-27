<template>
  <div class="home">
    <div class="hero flex">
      <div class="nav">
        <a href="https://github.com/stevenxie" target="_blank">
          <h5>github</h5>
        </a>
      </div>
      <h1>Hi.</h1>
      <h3>My name is Steven, and I build things.</h3>
    </div>
    <div class="about flex">
      <pre>{{ about }}</pre>
      <div class="api-status">
        api
        <div class="circle" />
      </div>
    </div>
    <div class="info">
      <!-- ...and more soon... -->
    </div>
  </div>
</template>

<script>
import { parse as parseDate, distanceInWords } from "date-fns";
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

// Declare constants.
const BIRTH_DATE = parseDate("1999-05-04");

export default {
  data: () => ({
    about: {
      name: "Steven Xie",
      age: distanceInWords(new Date(), BIRTH_DATE),
      depressed: "questionable",
    },
  }),
};
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  padding: 2.5em 1.75em 3.5em 1.75em;
  align-items: stretch;

  color: white;
  background-image: linear-gradient(
    119deg,
    #3294ff 0%,
    #cb6ab7 49%,
    #eb7155 100%
  );

  .nav {
    position: absolute;
    top: 0.8em;
    right: 1em;

    a {
      text-decoration-color: white;
      color: white;
    }

    h5 {
      font-size: 14pt;
      font-weight: 500;
      transition: opacity 200ms ease-in-out;
      // prettier-ignore
      &:hover { opacity: 0.7; }
    }
  }

  h1 {
    margin-top: 0.6em;
    font-size: 58pt;
  }
  h3 {
    margin-top: 0.4em;
    font-size: 18pt;
  }
}

.about {
  padding: 1.5em 1em 1.75em 1em;
  position: relative;

  color: rgb(236, 236, 236);
  background-color: #2b2b2b;
  font-family: "Roboto Mono", "Courier New", monospace;
  font-weight: 500;

  pre {
    font-family: inherit;
    font-weight: inherit;
    font-size: 11pt;
  }

  .api-status {
    position: absolute;
    bottom: 0.8em;
    right: 0.8em;
    padding: 0.4em 0.7em;
    border-radius: 8px;

    display: flex;
    align-items: center;

    color: #b2b2b2;
    background-color: #121212;
    font-size: 11pt;

    .circle {
      width: 0.8em;
      height: 0.8em;
      margin-left: 0.5em;
      border-radius: 50%;
      background-color: rgb(209, 43, 43);

      // prettier-ignore
      &.active { background-color: #24c96c; }
    }
  }
}
</style>
