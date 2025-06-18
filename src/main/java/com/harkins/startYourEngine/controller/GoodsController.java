package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.request.CreateGoodsRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.GoodsDetailsResponse;
import com.harkins.startYourEngine.dto.response.GoodsResponse;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.service.FileStorageService;
import com.harkins.startYourEngine.service.GoodsReviewService;
import com.harkins.startYourEngine.service.GoodsService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("/goods")
@Slf4j
public class GoodsController {
    GoodsService goodsService;
    GoodsReviewService goodsReviewService;
    FileStorageService fileStorageService;

    @GetMapping("/details/{goodsId}")
    public ResponseEntity<?> getGoodsWithReviews(@PathVariable("goodsId") String goodsId) {
        try {
            GoodsResponse goods = goodsService.getGoodsById(goodsId);
            List<GoodsReviewResponse> reviews = goodsReviewService.getReviewByGoods(goodsId);
            GoodsDetailsResponse response = new GoodsDetailsResponse(goods, reviews);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving goods details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve goods details: " + e.getMessage());
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<GoodsResponse> createGoods(@RequestBody @Valid CreateGoodsRequest request) {
        log.info("Received goods: {}", request);
        try {
            GoodsResponse result = goodsService.createGoods(request);
            return ApiResponse.<GoodsResponse>builder()
                    .code(1000)
                    .result(result)
                    .build();
        } catch (Exception e) {
            log.error("Error creating goods: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

//    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ApiResponse<List<String>> uploadImages(
//            @RequestParam(value = "goodsId", required = false) String goodsId,
//            @RequestParam("images") MultipartFile[] images) {
//        log.info("Received images for goodsId: {}", goodsId);
//        try {
//            if (images == null || images.length == 0) {
//                throw new AppException(ErrorCode.FILE_EMPTY);
//            }
//            List<String> imageUrls = new ArrayList<>();
//            for (MultipartFile image : images) {
//                if (image.isEmpty()) {
//                    throw new AppException(ErrorCode.FILE_EMPTY);
//                }
//                if (image.getSize() > 5 * 1024 * 1024) {
//                    throw new AppException(ErrorCode.FILE_TOO_LARGE);
//                }
//                String imageUrl = fileStorageService.uploadFile(image);
//                imageUrls.add(imageUrl);
//            }
//            // Nếu có goodsId, cập nhật ảnh chính
//            if (goodsId != null) {
//                goodsService.updateGoodsImage(goodsId, imageUrls.getFirst());
//            }
//            return ApiResponse.<List<String>>builder()
//                    .code(1000)
//                    .result(imageUrls)
//                    .build();
//        } catch (Exception e) {
//            log.error("Error uploading images: {}", e.getMessage(), e);
//            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("/all-goods")
    ApiResponse<List<GoodsResponse>> getGoods() {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoods())
                .build();
    }

    @GetMapping("/page")
    public ApiResponse<Page<GoodsResponse>> getGoodsPage(Pageable pageable) {
        return ApiResponse.<Page<GoodsResponse>>builder()
                .result(goodsService.getGoods(pageable))
                .build();
    }

    @GetMapping("/by-id/{goodsId}")
    ApiResponse<GoodsResponse> getGoodsById(@PathVariable("goodsId") String goodsId) {
        return ApiResponse.<GoodsResponse>builder()
                .result(goodsService.getGoodsById(goodsId))
                .build();
    }

    @GetMapping("/goodsName")
    ApiResponse<List<GoodsResponse>> getGoodsByName(@RequestParam("goodsName") String goodsName) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByName(goodsName))
                .build();
    }

    @GetMapping("/goodsCategory")
    ApiResponse<List<GoodsResponse>> getGoodsByCategory(@RequestParam("goodsCategory") String goodsCategory) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByCategory(goodsCategory))
                .build();
    }

    @GetMapping("/by-brand/{goodsBrand}")
    ApiResponse<List<GoodsResponse>> getGoodsByBrand(@PathVariable("goodsBrand") String goodsBrand) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByBrand(goodsBrand))
                .build();
    }

    @GetMapping("/by-price/{goodsPrice}")
    ApiResponse<List<GoodsResponse>> getGoodsByPrice(@PathVariable("goodsPrice") Long price) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByPrice(price))
                .build();
    }

    @GetMapping("/{minPrice}_{maxPrice}")
    ApiResponse<List<GoodsResponse>> getGoodsByPrice(@PathVariable("minPrice") Long minPrice,
                                                     @PathVariable("maxPrice") Long maxPrice) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByPriceRange(minPrice, maxPrice))
                .build();
    }

    @GetMapping("/by-rating")
    public ApiResponse<List<GoodsResponse>> getGoodsByRating(@RequestParam("min") int minRating) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByMinRating(minRating))
                .build();
    }

    @GetMapping("/sort-name-asc")
    public ApiResponse<List<GoodsResponse>> sortByNameAsc() {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsSortedByNameAsc())
                .build();
    }

    @GetMapping("/sort-name-desc")
    public ApiResponse<List<GoodsResponse>> sortByNameDesc() {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsSortedByNameDesc())
                .build();
    }

    @PutMapping("/{goodsId}")
    ApiResponse<GoodsResponse> updateGoods(@PathVariable("goodsId") String goodsId,
                                           @Valid @RequestBody UpdateGoodsRequest request) {
        return ApiResponse.<GoodsResponse>builder()
                .result(goodsService.updateGoods(goodsId, request))
                .build();
    }

    @DeleteMapping("/{goodsId}")
    ApiResponse<String> deleteGoods(@PathVariable("goodsId") String goodsId) {
        goodsService.deleteGoods(goodsId);
        return ApiResponse.<String>builder().result("Goods deleted").build();
    }
}