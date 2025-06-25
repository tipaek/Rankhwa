package com.rankhwa.backend.dto;


import java.time.Instant;

public record UserSummary (Long id, String displayName, Instant createdAt)
{}
