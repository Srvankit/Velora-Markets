package com.velora.markets.dto;

import java.util.List;
import java.util.Map;

public class AcademyOverviewResponse {
    private Long coinsBalance;
    private Long totalLessonsCompleted;
    private List<String> completedLessonIds;
    private Map<String, Integer> quizScores;
    private List<BadgeResponse> badges;
    private List<RedemptionResponse> recentRedemptions;

    public AcademyOverviewResponse() {}

    public Long getCoinsBalance() { return coinsBalance; }
    public void setCoinsBalance(Long coinsBalance) { this.coinsBalance = coinsBalance; }
    public Long getTotalLessonsCompleted() { return totalLessonsCompleted; }
    public void setTotalLessonsCompleted(Long totalLessonsCompleted) { this.totalLessonsCompleted = totalLessonsCompleted; }
    public List<String> getCompletedLessonIds() { return completedLessonIds; }
    public void setCompletedLessonIds(List<String> completedLessonIds) { this.completedLessonIds = completedLessonIds; }
    public Map<String, Integer> getQuizScores() { return quizScores; }
    public void setQuizScores(Map<String, Integer> quizScores) { this.quizScores = quizScores; }
    public List<BadgeResponse> getBadges() { return badges; }
    public void setBadges(List<BadgeResponse> badges) { this.badges = badges; }
    public List<RedemptionResponse> getRecentRedemptions() { return recentRedemptions; }
    public void setRecentRedemptions(List<RedemptionResponse> recentRedemptions) { this.recentRedemptions = recentRedemptions; }
}
