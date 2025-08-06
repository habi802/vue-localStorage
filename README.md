### 기존의 갤러리에서 비회원도 장바구니, 주문 기능을 사용할 수 있게 하는 코드
#### 수정 - 장바구니
- Home.vue, Cart.vue 에 코드 추가됨.
- Card.vue 에 있던 put 함수가 삭제되고, Home.vue 에 putItem 함수가 추가됨.

#### 수정 - 주문
- OrderForm.vue 에 코드 추가됨.

#### 수정 - 백엔드


## 내 로컬에서 보고 싶다면?

- git clone 어쩌구를 한 뒤
```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
