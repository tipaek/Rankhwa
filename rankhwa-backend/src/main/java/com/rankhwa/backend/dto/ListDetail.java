package com.rankhwa.backend.dto;

import java.util.List;

public record ListDetail(Long id,
                         String name,
                         boolean isDefault,
                         List<Long> manhwaIds) {}
