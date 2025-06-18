package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.request.CreateMomoRequest;
import com.harkins.startYourEngine.dto.response.CreateMomoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momo", url = "${momo.endpoint}")
public interface MomoApi {
    @PostMapping("/create")
    CreateMomoResponse createMomoQr(@RequestBody CreateMomoRequest createMomoRequest);
}
