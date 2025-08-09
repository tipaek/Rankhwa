package com.rankhwa.backend.dto;

import java.util.List;

public record ManhwaSummary (
        Long id,
        String title,
        String author,
        Double avgRating,
        Integer voteCount,
        String coverUrl,
        List<String> genres,
        String titleEnglish,
        String titleRomaji,
        String titleNative
){}
