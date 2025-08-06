### 기존의 갤러리에서 비회원도 장바구니, 주문 기능을 사용할 수 있게 하는 코드
#### 수정 - 장바구니
- Home.vue, Cart.vue 에 코드 추가됨.
- Card.vue 에 있던 put 함수가 삭제되고, Home.vue 에 putItem 함수가 추가됨.

#### 수정 - 주문
- OrderForm.vue 에 코드 추가됨.

#### 수정 - 백엔드
##### 백엔드는 프로젝트를 따로 생성하지 않고, 기존의 Gallery를 수정하였음.
- OrderMapper.xml
```xml
<insert id="save" useGeneratedKeys="true" keyProperty="orderId">
    INSERT INTO orders
    <trim prefix="SET" suffixOverrides=",">
        <if test="memberId != null and memberId != 0">
            member_id = #{memberId},
        </if>
        <if test="guestId != null and guestId != ''">
            guest_id = #{guestId},
        </if>
        name = #{name},
        address = #{address},
        payment = #{payment},
        <if test="cardNumber != null and cardNumber != ''">
            card_number = #{cardNumber},
        </if>
        amount = #{amount}
    </trim>
</insert>
```
- OrderService.java에 guestId 관련 코드가 추가되고,
  loggedMemberId가 null 이 아닐 경우에만 장바구니 테이블을 삭제하게 함.
- OrderPostReq, OrderPostDto 에 guestId 멤버 필드가 추가됨(타입은 String!)
- logginedMemberId, memberId 모두 int 타입으로 되어 있는데,
  guestId가 추가됨으로써 memberId가 null일 수 있으므로 모두 Integer 타입으로 바꿈.
