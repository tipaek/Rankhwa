package com.rankhwa.backend.controller;

import com.rankhwa.backend.dto.ManhwaDetail;
import com.rankhwa.backend.dto.ManhwaSummary;
import com.rankhwa.backend.model.Manhwa;
import com.rankhwa.backend.repository.ManhwaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manhwa")
@RequiredArgsConstructor
public class ManhwaController {
    private final ManhwaRepository manhwaRepository;

    // GET /manhwa?page=0&size=20&sort=rating|date&query=solo
    @GetMapping
    public List<ManhwaSummary> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "rating") String sort,
            @RequestParam(defaultValue = "") String query
    ) {
        Sort sortBy = switch (sort) {
            case "date" -> Sort.by("releaseDate").descending();
            case "rating" -> Sort.by("avgRating").descending();
            default -> Sort.by("title");
        };

        return manhwaRepository.findByTitleContainingIgnoreCase(
                query,
                PageRequest.of(page, size, sortBy)
                ).map(this::toSummary)
                        .getContent();

    }

    // GET /manhwa/{id}
    @GetMapping("/{id}")
    public ManhwaDetail get(@PathVariable Long id) {
        return manhwaRepository.findById(id).map(this::toDetail).orElseThrow();
    }

    // --- Mapping Helper Functions ---
    private ManhwaSummary toSummary(Manhwa m) {
        return new ManhwaSummary(
                m.getId(), m.getTitle(), m.getAuthor(),
                m.getAvgRating(), m.getVoteCount(), m.getCoverUrl()
        );
    }
    private ManhwaDetail toDetail(Manhwa m) {
        return new ManhwaDetail(
                m.getId(), m.getTitle(), m.getAuthor(), m.getDescription(),
                m.getReleaseDate(), m.getAvgRating(), m.getVoteCount(), m.getCoverUrl()
        );
    }
}
