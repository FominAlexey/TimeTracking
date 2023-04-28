<template>
  <v-app>
    <v-main>
      <component :is="this.$route.meta.layout"></component>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
