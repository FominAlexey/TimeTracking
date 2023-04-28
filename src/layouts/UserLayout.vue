<template>
  <Navbar>
    <router-view />
  </Navbar>
</template>
<script>
import Navbar from "@/components/Navbar.vue";
export default {
  name: "UserLayout",
  components: {
    Navbar: Navbar,
  },
};
</script>
