package com.rankhwa.backend.dto;

import java.time.Instant;

public record ListSummary (Long id,
                           String name,
                           boolean isDefault,
                           int itemCount,
                           Instant createdAt){}
