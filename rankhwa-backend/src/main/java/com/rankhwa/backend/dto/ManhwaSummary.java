package com.rankhwa.backend.dto;

public record ManhwaSummary (
        Long id,
        String title,
        String author,
        Double avgRating,
        Integer voteCount,
        String coverUrl
){}
