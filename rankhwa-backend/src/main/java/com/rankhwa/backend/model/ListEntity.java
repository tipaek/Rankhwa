package com.rankhwa.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="lists", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "name"}), indexes = @Index(name = "idx_lists_user", columnList = "user_id"))
@Getter
@Setter
@NoArgsConstructor
public class ListEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private User user;

    @Column(nullable = false) private String name;
    @Column(nullable = false) private boolean isDefault = false;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ListItem> items = new HashSet<>();
}
