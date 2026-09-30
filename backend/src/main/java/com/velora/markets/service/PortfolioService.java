package com.velora.markets.service;

import com.velora.markets.dto.HoldingResponse;
import com.velora.markets.dto.PortfolioResponse;
import com.velora.markets.entity.Holding;
import com.velora.markets.entity.Portfolio;
import com.velora.markets.entity.Stock;
import com.velora.markets.entity.User;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.HoldingRepository;
import com.velora.markets.repository.PortfolioRepository;
import com.velora.markets.repository.StockRepository;
import com.velora.markets.repository.UserRepository;
import com.velora.markets.security.SecurityUtils;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;
    private final MapperService mapper;

    public PortfolioService(
        PortfolioRepository portfolioRepository,
        HoldingRepository holdingRepository,
        StockRepository stockRepository,
        UserRepository userRepository,
        MapperService mapper
    ) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolio() {
        return buildPortfolio(currentUser());
    }

    @Transactional(readOnly = true)
    public PortfolioResponse buildPortfolio(User user) {
        Portfolio portfolio = portfolioRepository.findByUser(user)
            .orElseThrow(() -> new ApiException("Portfolio not found", HttpStatus.NOT_FOUND));

        List<Holding> holdings = holdingRepository.findByPortfolio(portfolio);
        Map<String, Stock> stocks = stockRepository.findAllById(
            holdings.stream().map(Holding::getSymbol).toList()
        ).stream().collect(Collectors.toMap(Stock::getSymbol, Function.identity()));

        List<HoldingResponse> holdingResponses = new ArrayList<>();
        BigDecimal investedValue = BigDecimal.ZERO;
        BigDecimal marketValue = BigDecimal.ZERO;

        for (Holding holding : holdings) {
            HoldingResponse hr = mapper.toHolding(holding, stocks.get(holding.getSymbol()));
            holdingResponses.add(hr);
            investedValue = investedValue.add(hr.getInvestedValue());
            marketValue = marketValue.add(hr.getMarketValue());
        }

        holdingResponses.sort(Comparator.comparing(HoldingResponse::getMarketValue).reversed());

        BigDecimal unrealized = marketValue.subtract(investedValue);
        BigDecimal realized = portfolio.getRealizedPnL();
        BigDecimal totalPnL = unrealized.add(realized);
        BigDecimal totalAccount = portfolio.getCashBalance().add(marketValue);
        BigDecimal returnPct = investedValue.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : unrealized.multiply(BigDecimal.valueOf(100)).divide(investedValue, 4, RoundingMode.HALF_UP);

        PortfolioResponse response = new PortfolioResponse();
        response.setPortfolioId(portfolio.getId());
        response.setCashBalance(mapper.scale(portfolio.getCashBalance()));
        response.setInvestedValue(mapper.scale(investedValue));
        response.setMarketValue(mapper.scale(marketValue));
        response.setTotalAccountValue(mapper.scale(totalAccount));
        response.setUnrealizedPnL(mapper.scale(unrealized));
        response.setRealizedPnL(mapper.scale(realized));
        response.setTotalPnL(mapper.scale(totalPnL));
        response.setReturnPercentage(mapper.scale(returnPct));
        response.setTotalHoldings(holdingResponses.size());
        response.setHoldings(holdingResponses);
        response.setCreatedAt(mapper.iso(portfolio.getCreatedAt()));
        response.setUpdatedAt(mapper.iso(portfolio.getUpdatedAt()));
        return response;
    }

    public Portfolio requirePortfolio(User user) {
        return portfolioRepository.findByUser(user)
            .orElseThrow(() -> new ApiException("Portfolio not found", HttpStatus.NOT_FOUND));
    }

    private User currentUser() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}
