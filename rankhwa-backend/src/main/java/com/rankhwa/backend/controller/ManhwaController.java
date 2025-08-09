package com.rankhwa.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rankhwa.backend.dto.ManhwaDetail;
import com.rankhwa.backend.dto.ManhwaSummary;
import com.rankhwa.backend.model.Manhwa;
import com.rankhwa.backend.repository.ManhwaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/manhwa")
@RequiredArgsConstructor
public class ManhwaController {
    private final ManhwaRepository manhwaRepository;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private static String nodeText(JsonNode n, String key) {
        return (n != null && n.hasNonNull(key)) ? n.get(key).asText() : null;
    }

    // GET /manhwa?page=0&size=20&sort=rating|date&query=solo
    @GetMapping
    public List<ManhwaSummary> list(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(required = false) Double min_rating,
            @RequestParam(required = false) Integer min_votes,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "rating") String sort, // rating|date|title
            @RequestParam(defaultValue = "") String genres,     // comma-separated
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String[] genreArray = genres.isBlank()
                ? new String[0]
                : genres.split("\\s*,\\s*");

        int offset = Math.max(page, 0) * Math.max(size, 1);

        var rows = manhwaRepository.advancedSearch(
                query,
                min_rating,
                min_votes,
                year,
                genreArray,
                genreArray.length,
                sort,
                size,
                offset
        );

        return rows.stream().map(this::toSummary).toList();

    }

    // GET /manhwa/{id}
    @GetMapping("/{id}")
    public ManhwaDetail get(@PathVariable Long id) {
        return manhwaRepository.findById(id).map(this::toDetail).orElseThrow();
    }

    // --- Mapping Helper Functions ---
    private ManhwaSummary toSummary(Manhwa m) {
        JsonNode titles = null;
        try { titles = MAPPER.readTree(m.getTitles()); } catch (Exception ignored) {}
        String english = m.getTitleEnglish();
        String romaji  = nodeText(titles, "romaji");
        String nativeT = m.getTitleNative();

        return new ManhwaSummary(
                m.getId(), m.getTitle(), m.getAuthor(),
                m.getAvgRating(), m.getVoteCount(), m.getCoverUrl(),
                parseGenres(m.getGenres()),
                english, romaji, nativeT
        );
    }
    private ManhwaDetail toDetail(Manhwa m) {
        JsonNode titles = null;
        try { titles = MAPPER.readTree(m.getTitles()); } catch (Exception ignored) {}
        String english = m.getTitleEnglish();
        String romaji  = nodeText(titles, "romaji");
        String nativeT = m.getTitleNative();

        return new ManhwaDetail(
                m.getId(), m.getTitle(), m.getAuthor(), m.getDescription(),
                m.getReleaseDate(), m.getAvgRating(), m.getVoteCount(), m.getCoverUrl(),
                parseGenres(m.getGenres()),
                english, romaji, nativeT
        );
    }
    private List<String> parseGenres(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return MAPPER.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
