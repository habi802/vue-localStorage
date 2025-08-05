<script setup>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';
  import { watch, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { check } from './services/accountService';
  import { useAccountStore } from './stores/account';

  const route = useRoute();
  const accountStore = useAccountStore();

  // 로그인 여부 확인
  const checkAccount = async () => {
    console.log('로그인 체크');
    const res = await check();
    console.log(res);
    if (res === undefined || res.status !== 200) {
      accountStore.setChecked(false);
      return;
    }

    accountStore.setChecked(true);
    accountStore.setLoggedIn(res.data > 0);
  }

  onMounted(() => {
    checkAccount();
  })

  watch(() => route.path, () => {
    checkAccount();
  });
</script>

<template>
  <template v-if="accountStore.state.checked">
    <Header />
    <router-view></router-view>
    <Footer />
  </template>
  <template v-else>
    서버 통신 오류
  </template>
</template>

<style scoped>

</style>
