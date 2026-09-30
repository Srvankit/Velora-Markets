package com.velora.markets.dto;

import jakarta.validation.constraints.NotBlank;

public class CompleteLessonRequest {

    @NotBlank
    private String lessonId;

    @NotBlank
    private String courseId;

    public CompleteLessonRequest() {}

    public CompleteLessonRequest(String lessonId, String courseId) {
        this.lessonId = lessonId;
        this.courseId = courseId;
    }

    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
}
