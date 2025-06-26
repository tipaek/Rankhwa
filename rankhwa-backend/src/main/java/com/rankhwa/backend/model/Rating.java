package com.rankhwa.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "ratings",
uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "manhwa_id"}))
@Getter
@Setter
public class Rating {
    @EmbeddedId
    private RatingPK id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY) private User user;

    @MapsId("manhwaId")
    @ManyToOne(fetch = FetchType.LAZY) private Manhwa manhwa;

    @Column(nullable = false) private int score;
    @UpdateTimestamp private Instant updatedAt;
}
