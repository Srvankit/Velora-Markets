package com.velora.markets.controller;

import com.velora.markets.dto.WalletLedgerResponse;
import com.velora.markets.dto.WalletSummaryResponse;
import com.velora.markets.service.WalletService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public ResponseEntity<WalletSummaryResponse> getWallet() {
        return ResponseEntity.ok(walletService.getWalletSummary());
    }

    @GetMapping("/ledger")
    public ResponseEntity<Page<WalletLedgerResponse>> getLedger(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(walletService.getLedger(page, size));
    }
}
