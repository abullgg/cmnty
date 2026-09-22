package com.abul.cmnty.cmntybackend.repository;

import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);
}
