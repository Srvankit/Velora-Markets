package com.velora.markets.controller;

import com.velora.markets.dto.OrderExecutionResponse;
import com.velora.markets.dto.OrderResponse;
import com.velora.markets.dto.PlaceOrderRequest;
import com.velora.markets.dto.TransactionResponse;
import com.velora.markets.service.TradingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/trading")
public class TradingController {

    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @GetMapping("/orders")
    public Page<OrderResponse> orders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return tradingService.getOrders(page, size);
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderExecutionResponse placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        return tradingService.placeOrder(request);
    }

    @GetMapping("/transactions")
    public Page<TransactionResponse> transactions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return tradingService.getTransactions(page, size);
    }
}
