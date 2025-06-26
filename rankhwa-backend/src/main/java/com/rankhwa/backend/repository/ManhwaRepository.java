package com.rankhwa.backend.repository;

import com.rankhwa.backend.model.Manhwa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ManhwaRepository extends JpaRepository<Manhwa, Long> {
    Page<Manhwa> findByTitleContainingIgnoreCase(String q, Pageable page);
}
