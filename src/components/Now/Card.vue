<template>
  <div class="card flex">
    <div class="viewport">
      <div class="content overlay flex">
        <slot />
      </div>
      <div class="error overlay flex" v-if="error">
        <alert-icon :width="30" :height="30" v-tooltip="error" />
      </div>
    </div>
    <div class="headers flex">
      <h4 class="title">
        <a class="text" :href="titleURL" target="_blank" v-if="titleURL">
          {{ title }}
        </a>
        <span class="text" v-else>{{ title }}</span>
      </h4>
      <h5 class="label">
        <a class="text" :href="labelURL" target="_blank" v-if="labelURL">
          {{ label }}
        </a>
        <span class="text" v-else>{{ label }}</span>
      </h5>
    </div>
  </div>
</template>

<script>
import AlertIcon from "@/components/icons/AlertIcon";

export default {
  props: {
    title: String,
    titleURL: String,
    label: String,
    labelURL: String,
    error: String,
  },
  components: { "alert-icon": AlertIcon },
};
</script>

<style lang="scss" scoped>
.card {
  width: 240px;
  height: 300px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 8px;

  background: white;
  box-shadow: 0 4px 14px 0 rgba(black, 0.5);
}

.viewport {
  align-self: stretch;
  padding-top: 100%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

// prettier-ignore
.overlay {
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
}

.error {
  align-items: center;
  justify-content: center;
  background: rgba(white, 0.9);
}

.headers {
  flex: 1;
  align-items: center;
  justify-content: center;

  > * {
    width: 100%;
    a {
      transition: color 200ms;
    }
  }

  .title {
    $color: #1a1a1a;

    color: $color;
    a:hover {
      color: lighten($color, 22%);
    }
  }

  .label {
    $color: #808080;

    margin-top: 2px;
    font-weight: 500;
    color: $color;
    a:hover {
      color: lighten($color, 12%);
    }
  }
}

.text {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}

a {
  color: inherit;
  text-decoration: none;
}

// prettier-ignore
h4 { font-weight: 600; }
</style>
