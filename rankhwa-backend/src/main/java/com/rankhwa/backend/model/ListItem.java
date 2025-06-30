package com.rankhwa.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "list_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"list_id", "manhwa_id"}))
@Getter
@Setter
@NoArgsConstructor
public class ListItem {
    @EmbeddedId private ListItemPK id;

    @ManyToOne(fetch = FetchType.LAZY) @MapsId("listId") private ListEntity list;
    @ManyToOne(fetch = FetchType.LAZY) @MapsId("manhwaId") private Manhwa manhwa;

    @CreationTimestamp
    private Instant addedAt;
}
