package com.fresherjobs.repository;

import com.fresherjobs.entity.User;
import com.fresherjobs.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByRole(Role role);

    List<User> findAllByRoleAndIsApproved(Role role, Boolean isApproved);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);
}
