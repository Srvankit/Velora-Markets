package com.velora.markets.repository;

import com.velora.markets.entity.UserLessonProgress;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {
    List<UserLessonProgress> findByUserId(Long userId);
    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, String lessonId);
    List<UserLessonProgress> findByUserIdAndCourseId(Long userId, String courseId);
    long countByUserIdAndCompletedTrue(Long userId);
    long countByUserIdAndCourseIdAndCompletedTrue(Long userId, String courseId);
}
