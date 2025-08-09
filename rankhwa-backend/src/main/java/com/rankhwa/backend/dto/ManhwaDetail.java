package com.rankhwa.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record ManhwaDetail (
        Long id,
        String title,
        String author,
        String description,
        LocalDate releaseDate,
        Double avgRating,
        Integer voteCount,
        String coverUrl,
        List<String> genres,
        String titleEnglish,
        String titleRomaji,
        String titleNative
){}
