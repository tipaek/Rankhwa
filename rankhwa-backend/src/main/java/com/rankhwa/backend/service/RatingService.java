package com.rankhwa.backend.service;

import com.rankhwa.backend.model.Manhwa;
import com.rankhwa.backend.model.Rating;
import com.rankhwa.backend.model.RatingPK;
import com.rankhwa.backend.model.User;
import com.rankhwa.backend.repository.ManhwaRepository;
import com.rankhwa.backend.repository.RatingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final ManhwaRepository manhwaRepository;

    @Transactional
    public void rate(User user, Long manhwaId, int score) {
        RatingPK pk = new RatingPK(user.getId(), manhwaId);
        Rating r = ratingRepository.findById(pk).orElseGet(() -> {
            Rating nr = new Rating();
            nr.setId(pk);
            nr.setUser(user);
            nr.setManhwa(manhwaRepository.getReferenceById(manhwaId));
            return nr;
        });
        r.setScore(score);
        ratingRepository.save(r);

        // recompute cached fields
        Double avg = ratingRepository.computeAverage(manhwaId);
        int votes = ratingRepository.countByManhwaId(manhwaId);
        Manhwa m = r.getManhwa();
        m.setAvgRating(avg);
        m.setVoteCount(votes);
        manhwaRepository.save(m);
    }
}
