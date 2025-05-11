package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.GoodsReview;
import com.harkins.startYourEngine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsReviewRepository extends JpaRepository<GoodsReview, String> {
    List<GoodsReview> findByGoods_GoodsId(String goodsId);

    boolean existsByGoodsAndUser(Goods goods, User user);
}
