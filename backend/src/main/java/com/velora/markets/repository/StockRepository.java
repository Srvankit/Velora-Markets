package com.velora.markets.repository;

import com.velora.markets.entity.Stock;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockRepository extends JpaRepository<Stock, String> {
    @Query("""
        SELECT s FROM Stock s
        WHERE LOWER(s.symbol) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(s.companyName) LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY s.symbol ASC
        """)
    List<Stock> search(@Param("query") String query);
}
