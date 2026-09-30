package com.velora.markets.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_lesson_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "lesson_id", nullable = false, length = 80)
    private String lessonId;

    @Column(name = "course_id", nullable = false, length = 80)
    private String courseId;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "quiz_score")
    private Integer quizScore;

    @Column(name = "quiz_passed")
    private boolean quizPassed = false;

    @Column(name = "attempts", nullable = false)
    private int attempts = 0;

    @Column(name = "completed_at")
    private Instant completedAt;

    public UserLessonProgress() {}

    public UserLessonProgress(User user, String lessonId, String courseId) {
        this.user = user;
        this.lessonId = lessonId;
        this.courseId = courseId;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public Integer getQuizScore() { return quizScore; }
    public void setQuizScore(Integer quizScore) { this.quizScore = quizScore; }
    public boolean isQuizPassed() { return quizPassed; }
    public void setQuizPassed(boolean quizPassed) { this.quizPassed = quizPassed; }
    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
