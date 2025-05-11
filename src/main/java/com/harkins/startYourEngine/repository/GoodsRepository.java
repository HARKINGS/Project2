package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, String> {

    boolean existsByGoodsName(String goodsName);

    List<Goods> findByGoodsNameContainingIgnoreCase(String goodsName);

    List<Goods> findByGoodsCategory(String goodsCategory);
}
