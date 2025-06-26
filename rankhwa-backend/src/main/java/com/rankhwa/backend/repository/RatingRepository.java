package com.rankhwa.backend.repository;

import com.rankhwa.backend.model.Rating;
import com.rankhwa.backend.model.RatingPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, RatingPK> {
    Optional<Rating> findByUserIdAndManhwaId(Long userId, Long manhwaId);

    @Query("select avg(r.score) from Rating r where r.manhwa.id = :manhwaId")
    Double computeAverage(Long manhwaId);
    int countByManhwaId(Long manhwaId);
}
