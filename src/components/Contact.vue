<template>
  <div class="contact flex">
    <img class="avatar" src="@/assets/ori.svg" />
    <h2 class="chat">Wanna chat?</h2>
    <p class="message">Shoot me a message at</p>
    <div class="email mono flex">
      <a class="mailtoui" :href="mailtoURL">{{ email }}</a>
    </div>
  </div>
</template>

<script>
export default {
  // TODO: Receive programatically using API + Vuex.
  data: () => ({ email: "hello@stevenxie.me" }),
  computed: {
    mailtoURL() {
      return "mailto:" + this.email;
    },
  },
};
</script>

<style lang="scss">
.contact {
  padding: 28px 0 34px 0;
  align-items: center;
  background-image: linear-gradient(180deg, #cadae6 37%, #b9c8d0 100%);
}

.avatar {
  height: 56px;
  margin: 0 0 6px 0;
}

.chat {
  font-size: 15pt;
  font-weight: 600;
  color: #454545;
}

.message {
  font-size: 13pt;
  color: #454545;
}

.email {
  $background: #ebf5fa;

  margin-top: 12px;
  padding: 9px 15px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  font-weight: 500;
  background: $background;
  color: #225cec;

  transition: background 200ms ease-in-out;
  &:hover {
    background: lighten($background, 4%);
  }
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
