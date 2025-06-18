package com.aidims.aidimsbackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aidims.aidimsbackend.entity.Role;
import com.aidims.aidimsbackend.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.is_active = true AND u.role.name = :role")
    Optional<User> findActiveUserByUsernameAndRole(@Param("username") String username, @Param("role") String role);

    boolean existsByUsername(String username);
}
