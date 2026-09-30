package com.velora.markets.controller;

import com.velora.markets.dto.BillingPlanResponse;
import com.velora.markets.dto.SubscribeRequest;
import com.velora.markets.dto.SubscriptionResponse;
import com.velora.markets.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<BillingPlanResponse>> getPlans() {
        return ResponseEntity.ok(billingService.getPlans());
    }

    @GetMapping("/subscription")
    public ResponseEntity<SubscriptionResponse> getSubscription() {
        return ResponseEntity.ok(billingService.getCurrentSubscription());
    }

    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionResponse> subscribe(@Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.ok(billingService.subscribe(request));
    }
}
