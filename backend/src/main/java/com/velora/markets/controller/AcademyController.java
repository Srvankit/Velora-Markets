package com.velora.markets.controller;

import com.velora.markets.dto.*;
import com.velora.markets.service.AcademyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/academy")
public class AcademyController {

    private final AcademyService academyService;

    public AcademyController(AcademyService academyService) {
        this.academyService = academyService;
    }

    @GetMapping("/overview")
    public AcademyOverviewResponse overview() {
        return academyService.getOverview();
    }

    @PostMapping("/lessons/complete")
    public AcademyOverviewResponse completeLesson(@Valid @RequestBody CompleteLessonRequest request) {
        return academyService.completeLesson(request);
    }

    @PostMapping("/quizzes/submit")
    public QuizResultResponse submitQuiz(@Valid @RequestBody SubmitQuizRequest request) {
        return academyService.submitQuiz(request);
    }

    @PostMapping("/redeem")
    public RedemptionResponse redeem(@Valid @RequestBody RedeemCoinsRequest request) {
        return academyService.redeemCoins(request);
    }

    @GetMapping("/rewards/history")
    public List<RewardHistoryItemResponse> rewardHistory() {
        return academyService.getRewardHistory();
    }
}
