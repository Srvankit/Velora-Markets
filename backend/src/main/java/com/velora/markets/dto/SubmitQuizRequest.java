package com.velora.markets.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class SubmitQuizRequest {

    @NotBlank
    private String quizId;

    @NotBlank
    private String courseId;

    @Min(0)
    @Max(100)
    private int score;

    private boolean passed;

    public SubmitQuizRequest() {}

    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
}
