<script setup>
  import { getItems, removeItem, removeCart } from '@/services/cartService';
  import { onMounted, reactive, ref } from 'vue';

  const state = reactive({
    items: []
  });

  const total = ref(0);

  // 장바구니 상품 조회
  const load = async () => {
    const res = await getItems();

    if (res.status !== 200) {
      return;
    }

    state.items = res.data;
    calculateTotal();
  };

  // 장바구니 상품 삭제
  const remove = async cartId => {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }
    
    const res = await removeItem(cartId);
    if (res === undefined || res.status !== 200) {
      return;
    }

    //load();
    if (res.data === 1) {
      const deleteIdx = state.items.findIndex(item => item.id === cartId);
      if (deleteIdx > -1) {
        state.items.splice(deleteIdx, 1);
        calculateTotal();
      }
    }
  };

  // 장바구니 총 금액
  const calculateTotal = () => {
    total.value = 0;

    state.items.forEach(item => {
      const price = item.price - item.price * item.discountPer / 100;
      total.value += price;
    });

    total.value = total.value.toLocaleString();
  };

  // 장바구니 비우기
  const clear = async () => {
    if (!confirm('장바구니를 비우시겠습니까?')) {
      return;
    }

    const res = await removeCart();
    if (res === undefined || res.status !== 200) {
      return;
    }

    state.items = [];
  }

  onMounted(() => {
    load();
  })
</script>

<template>
  <div class="cart">
    <div class="container">
      <template v-if="state.items.length">
        <ul class="items">
          <li v-for="i in state.items" :key="i.id">
            <img :alt="`상품 사진(${i.name})`" :src="`/pic/item/${i.imgPath}`" />
            <b class="name">{{ i.name }}</b>
            <span class="price">
              {{ (i.price - i.price * i.discountPer / 100).toLocaleString() }}원
            </span>
            <span class="remove float-end" @click="remove(i.id)" title="삭제">&times;</span>
          </li>
          <li class="total">
            <b>총 금액</b>
            <span class="price">{{ total }}원</span>
          </li>
        </ul>
        <div class="act d-flex justify-content-around">
          <button @click="clear" class="btn btn-danger">장바구니 비우기</button>
          <router-link to="/order" class="btn btn-primary">주문하기</router-link>
        </div>
      </template>
      <div class="text-center py-5" v-else>
        장바구니가 비어있습니다.
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .cart {
    .items {
      list-style: none;
      margin: 0;
      padding: 0;
  
      li {
        border: 1px solid #eee;
        margin-top: 25px;
        margin-bottom: 25px;
      }

      img {
        width: 150px;
        height: 150px;
      }

      .name {
        margin-left: 25px;
      }

      .price {
        margin-left: 25px;
      }

      .remove {
        cursor: pointer;
        font-size: 30px;
        padding: 5px 15px;
      }

      .total {
        padding: 25px 50px;
      }
    }

    .act .btn {
      width: 300px;
      display: block;
      padding: 30px 50px;
      font-size: 20px;
    }
  }
</style>