package com.abul.cmnty.cmntybackend.repository;

import com.abul.cmnty.cmntybackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
