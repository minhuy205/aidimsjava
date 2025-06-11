// UserRepository.java
package com.aidims.repository;

import com.aidims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
