package com.rankhwa.backend.dto;

import java.time.Instant;

public record UserSelfResponse (
        Long id,
        String email,
        String displayName,
        Instant createdAt
) {}
