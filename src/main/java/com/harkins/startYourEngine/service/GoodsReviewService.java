package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.request.CreateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.GoodsReview;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.GoodsReviewMapper;
import com.harkins.startYourEngine.repository.GoodsRepository;
import com.harkins.startYourEngine.repository.GoodsReviewRepository;
import com.harkins.startYourEngine.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoodsReviewService {

    GoodsReviewRepository goodsReviewRepository;
    GoodsRepository goodsRepository;
    GoodsReviewMapper goodsReviewMapper;
    UserRepository userRepository;

    @PreAuthorize("hasAuthority('CREATE_REVIEWS')")
    @Transactional
    public GoodsReviewResponse createReview(String goodsId, CreateGoodsReviewRequest request) {
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new AppException(ErrorCode.GOODS_NOT_FOUND));

//        Lấy user từ SecurityContext
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = jwt.getSubject(); // vì bạn set username vào "sub" trong token

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (goodsReviewRepository.existsByGoodsAndUser_Username(goods, user.getUsername())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        GoodsReview goodsReview = GoodsReview.builder()
                .user(user)
                .goods(goods)
                .content(request.getContent())
                .rating(request.getRating())
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();

        GoodsReview savedGoodsReview = goodsReviewRepository.save(goodsReview);
        return goodsReviewMapper.toReviewResponse(savedGoodsReview);
    }

    @PreAuthorize("hasAuthority('GET_REVIEWS_BY_ID')")
    public GoodsReviewResponse getReviewById(String reviewId) {
        GoodsReview goodsReview = goodsReviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        return goodsReviewMapper.toReviewResponse(goodsReview);
    }

    @PreAuthorize("hasAuthority('GET_ALL_REVIEWS')")
    public List<GoodsReviewResponse> getAllReviews() {
        return goodsReviewRepository.findAll().stream()
                .map(goodsReviewMapper::toReviewResponse)
                .toList();
    }

    @PreAuthorize("hasAuthority('GET_REVIEWS_BY_GOODS')")
    public List<GoodsReviewResponse> getReviewByGoods(String goodsId) {
        return goodsReviewRepository.findByGoods_GoodsId(goodsId).stream()
                .map(goodsReviewMapper::toReviewResponse)
                .toList();
    }

    @PreAuthorize("hasAuthority('UPDATE_REVIEWS')")
    @Transactional
    public GoodsReviewResponse updateGoodsReview(String reviewId, UpdateGoodsReviewRequest request) {
        GoodsReview existingGoodsReview = goodsReviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        log.info("Thông tin về goodsReview: ", existingGoodsReview);

        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = jwt.getSubject();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));


        // Kiểm tra quyền sở hữu (tùy chọn)
        if (!existingGoodsReview.getUser().getUsername().equals(currentUser.getUsername())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        log.info("User {} attempting to update review {}", username, reviewId);
        log.info("Authorities: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        if (request.getContent() != null) {
            existingGoodsReview.setContent(request.getContent());
        }
        if (request.getRating() != null) {
            existingGoodsReview.setRating(request.getRating());
        }

        existingGoodsReview.setUpdatedAt(new Date());
        GoodsReview updatedGoodsReview = goodsReviewRepository.save(existingGoodsReview);
        return goodsReviewMapper.toReviewResponse(updatedGoodsReview);
    }

    @PreAuthorize("hasAuthority('DELETE_REVIEWS')")
    public void deleteGoodsReview(String reviewId) {
        goodsReviewRepository.deleteById(reviewId);
    }

    @PreAuthorize("hasAuthority('DELETE_REVIEWS')")
    @Transactional
    public void deleteGoodsReviewByUserId(String userId) { goodsReviewRepository.deleteByUser_UserId(userId); }
}
