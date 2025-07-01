package com.rankhwa.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "manhwa",
        indexes = {
                @Index(name = "idx_manhwa_title", columnList = "title"),
                @Index(name = "idx_manhwa_author", columnList = "author")
        }

)
@Getter
@Setter
public class Manhwa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String author;

    @Column(columnDefinition = "text")
    private String description;

    private String coverUrl;

    private LocalDate releaseDate;

    private Double avgRating = 0.0;
    private Integer voteCount = 0;

    // --- for anilist seeding ---
    @Column(name = "anilist_id", unique = true)
    private Long anilistId;
    @Column(name = "seed_popularity")
    private Integer seedPopularity = 0;
    @Column(name = "title_native")
    private String titleNative;
    @Column(name = "title_english")
    private String titleEnglish;
    @Column(columnDefinition = "jsonb")
    private String titles;

}
