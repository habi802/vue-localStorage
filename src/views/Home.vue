<script setup>
  import { onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  import Card from '@/components/Card.vue';

  import { getItems } from '@/services/itemService';
  import { addItem } from '@/services/cartService';

  import { useAccountStore } from '@/stores/account';

  const accountStore = useAccountStore();

  const state = reactive({
    items: []
  });

  onMounted(async () => {
    const res = await getItems();

    if (res.status !== 200) {
      return;
    }

    console.log(res.data);

    state.items = res.data;
  });

  // 장바구니에 상품 담기
  // putItem은 $emit을 써서 선택한 item을 Card.vue에서 받아옴
  const putItem = async selectedItem => {
    if (!accountStore.state.loggedIn) {
      // 비회원일 경우 localStorage에 저장
      const myCart = localStorage.getItem('myCart');
      let cartItems; // localStorage의 'myCart'를 수정하기 위한 변수
      if (myCart === undefined || myCart === null || JSON.parse(myCart).items.length < 1) {
        // localStorage의 'myCart'가 없거나 비었을 경우
        // 즉, 비회원 장바구니에 아무 것도 없을 경우
        // cartItems를 빈 배열로 함
        cartItems = [];
      } else {
        // 비회원 장바구니에 하나라도 있을 경우
        // localStorage의 'myCart' 를 JSON 문자열에서 객체로 변환한 뒤
        // 그 객체 안에 있는 items의 속성값(배열)을 cartItems에 넣음
        cartItems = JSON.parse(myCart).items;
      }

      // 선택한 item의 id가 cartItems의 id 중에 겹치는 게 있을 경우
      // 즉, 비회원 장바구니에 이미 선택한 상품이 담겨져 있을 경우
      const duplicatedIdx = cartItems.findIndex(item => item.id === selectedItem.id);
      if (duplicatedIdx >= 0) {
        alert('이미 장바구니에 상품이 담겨져 있습니다.');
        return;
      }

      try {
        // cartItems에 item을 넣고 id 순으로 정렬한 뒤,
        // items라는 속성을 가진 객체의 속성값에 넣은 후,
        // 그 객체를 JSON 문자열로 변환하여
        // localStorage의 'myCart'에 넣음
        cartItems.push(selectedItem);
        cartItems.sort((a, b) => a.id - b.id);
        const jsonCartItems = JSON.stringify({
          items: cartItems
        });
        localStorage.setItem('myCart', jsonCartItems);
        //console.log(localStorage.getItem('myCart'));
        
        // 성공 시 장바구니 이동 가능
        if (confirm('장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?')) {
          router.push({ path: '/cart' });
        }
      } catch (error) {
        console.log(error.message);
        alert('장바구니 등록에 실패하였습니다.');
      }
    } else {
      // 회원일 경우 장바구니 DB에 저장
      const res = await addItem(selectedItem.id);

      if (res === undefined) {
        alert('서버에 문제가 있습니다.');
        return;
      } else if (res.status === 500) {
        alert('이미 장바구니에 상품이 담겨져 있습니다.');
      } else if (confirm('장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?')) {
        router.push({ path: '/cart' });
        console.log('카트 담기 성공');
      }
    }
  };
</script>

<template>
  <div class="home">
    <div class="container">
      <h1 class="mt-5">HELLO, HOME</h1>
      <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-3">
        <div class="col" v-for="item in state.items" :key="item.id">
          <Card :item="item" @put-item="putItem" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
