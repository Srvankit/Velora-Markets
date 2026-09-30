package com.velora.markets.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "badge_rewards", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "badge_code"})
})
public class BadgeReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "badge_code", nullable = false, length = 60)
    private String badgeCode;

    @Column(name = "badge_name", nullable = false, length = 100)
    private String badgeName;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(length = 60)
    private String icon;

    @Column(name = "unlocked_at", nullable = false, updatable = false)
    private Instant unlockedAt = Instant.now();

    public BadgeReward() {}

    public BadgeReward(User user, String badgeCode, String badgeName, String description, String icon) {
        this.user = user;
        this.badgeCode = badgeCode;
        this.badgeName = badgeName;
        this.description = description;
        this.icon = icon;
        this.unlockedAt = Instant.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getBadgeCode() { return badgeCode; }
    public void setBadgeCode(String badgeCode) { this.badgeCode = badgeCode; }
    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Instant getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(Instant unlockedAt) { this.unlockedAt = unlockedAt; }
}
