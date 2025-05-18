package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.GoodsReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsReviewRepository extends JpaRepository<GoodsReview, String> {
    List<GoodsReview> findByGoods_GoodsId(String goodsId);

    boolean existsByGoodsAndUserName(Goods goods, String userName);

//    List<Goods> findGoodsByRating(double rating);
}
