package com.abul.cmnty.cmntybackend.repository;

import com.abul.cmnty.cmntybackend.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    java.util.List<Club> findByCity(String city);
}
