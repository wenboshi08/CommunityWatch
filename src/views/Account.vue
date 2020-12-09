<template>
  <div>
	<UserSettings/>
  </div>
</template>

<script>
import UserSettings from "../components/UserSettings.vue";
import Navbar from "../components/Navbar.vue";
export default {
  name: "account",
  components: {
	UserSettings,
	Navbar
}
};
</script>