package com.rankhwa.backend.dto;

import java.time.LocalDate;

public record ManhwaDetail (
        Long id,
        String title,
        String author,
        String description,
        LocalDate releaseDate,
        Double avgRating,
        Integer voteCount,
        String coverUrl
){}
