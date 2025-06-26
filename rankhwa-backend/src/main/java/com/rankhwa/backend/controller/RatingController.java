package com.rankhwa.backend.controller;

import com.rankhwa.backend.model.User;
import com.rankhwa.backend.repository.RatingRepository;
import com.rankhwa.backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/manhwa/{id}/rating")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService svc;
    private final RatingRepository ratings;

    @PostMapping
    public ResponseEntity<?> rate(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal User user
            ) {
        int score = body.getOrDefault("score", 0);
        if (score < 1 || score > 10) return ResponseEntity.badRequest().build();

        svc.rate(user, id, score);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public Map<String, Integer> myRating(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ratings.findByUserIdAndManhwaId(user.getId(), id)
                .map(r -> Map.of("score", r.getScore()))
                .orElse(Map.of("score", 0));
    }

}
