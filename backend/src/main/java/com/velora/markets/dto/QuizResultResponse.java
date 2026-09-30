package com.velora.markets.dto;

import java.util.List;

public class QuizResultResponse {
    private String quizId;
    private int score;
    private boolean passed;
    private long coinsAwarded;
    private long totalCoins;
    private List<BadgeResponse> newBadges;

    public QuizResultResponse() {}

    public QuizResultResponse(String quizId, int score, boolean passed, long coinsAwarded, long totalCoins, List<BadgeResponse> newBadges) {
        this.quizId = quizId;
        this.score = score;
        this.passed = passed;
        this.coinsAwarded = coinsAwarded;
        this.totalCoins = totalCoins;
        this.newBadges = newBadges;
    }

    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
    public long getCoinsAwarded() { return coinsAwarded; }
    public void setCoinsAwarded(long coinsAwarded) { this.coinsAwarded = coinsAwarded; }
    public long getTotalCoins() { return totalCoins; }
    public void setTotalCoins(long totalCoins) { this.totalCoins = totalCoins; }
    public List<BadgeResponse> getNewBadges() { return newBadges; }
    public void setNewBadges(List<BadgeResponse> newBadges) { this.newBadges = newBadges; }
}
