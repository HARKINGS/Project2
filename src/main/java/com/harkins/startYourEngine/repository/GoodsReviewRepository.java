package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.GoodsReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsReviewRepository extends JpaRepository<GoodsReview, String> {
    List<GoodsReview> findByGoods_GoodsId(String goodsId);

    boolean existsByGoodsAndUser_Username(Goods goods, String userName);

    void deleteByUser_UserId(String userId);

//    List<Goods> findGoodsByRating(double rating);
}
