package com.rankhwa.backend.repository;

import com.rankhwa.backend.model.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListRepository extends JpaRepository<ListEntity, Long> {
    List<ListEntity> findByUserId(Long userId);
    boolean existsByUserIdAndName(Long userId, String name);
}
