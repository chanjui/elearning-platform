package com.elearning.user.repository;

import com.elearning.user.entity.User;
import com.elearning.user.entity.UserLearningDashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLearningDashboardRepository extends JpaRepository<UserLearningDashboard, Long> {
    Optional<UserLearningDashboard> findByUser(User user);
} 