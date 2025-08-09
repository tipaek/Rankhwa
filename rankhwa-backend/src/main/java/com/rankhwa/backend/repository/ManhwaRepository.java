package com.rankhwa.backend.repository;

import com.rankhwa.backend.model.Manhwa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ManhwaRepository extends JpaRepository<Manhwa, Long> {
    Page<Manhwa> findByTitleContainingIgnoreCase(String q, Pageable page);

    @Query(value = """
    SELECT * FROM manhwa m
    WHERE (:q = '' OR LOWER(m.title) LIKE LOWER(CONCAT('%', :q, '%')))
      AND (:minRating IS NULL OR m.avg_rating >= :minRating)
      AND (:minVotes  IS NULL OR m.vote_count >= :minVotes)
      AND (:year      IS NULL OR EXTRACT(YEAR FROM m.release_date) = :year)
      AND (
        :genresCount = 0
        OR jsonb_exists_any(m.genres, CAST(:genres AS text[]))
      )
    ORDER BY
      CASE WHEN :sort = 'date'   THEN m.release_date END DESC,
      CASE WHEN :sort = 'rating' THEN m.avg_rating  END DESC,
      CASE WHEN :sort = 'title'  THEN m.title       END ASC,
      m.avg_rating DESC, m.vote_count DESC
    LIMIT :size OFFSET :offset
    """,
            nativeQuery = true)
    List<Manhwa> advancedSearch(
            @Param("q") String q,
            @Param("minRating") Double minRating,
            @Param("minVotes") Integer minVotes,
            @Param("year") Integer year,
            @Param("genres") String[] genres,
            @Param("genresCount") int genresCount,
            @Param("sort") String sort,
            @Param("size") int size,
            @Param("offset") int offset
    );

    @Query(value = """
    SELECT COUNT(*) FROM manhwa m
    WHERE (:q = '' OR LOWER(m.title) LIKE LOWER(CONCAT('%', :q, '%')))
      AND (:minRating IS NULL OR m.avg_rating >= :minRating)
      AND (:minVotes  IS NULL OR m.vote_count >= :minVotes)
      AND (:year      IS NULL OR EXTRACT(YEAR FROM m.release_date) = :year)
      AND (
        :genresCount = 0
        OR jsonb_exists_any(m.genres, CAST(:genres AS text[]))
      )
    """,
            nativeQuery = true)
    long advancedSearchCount(
            @Param("q") String q,
            @Param("minRating") Double minRating,
            @Param("minVotes") Integer minVotes,
            @Param("year") Integer year,
            @Param("genres") String[] genres,
            @Param("genresCount") int genresCount
    );
}
