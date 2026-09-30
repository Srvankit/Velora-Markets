package com.velora.markets.dto;

public class BadgeResponse {
    private String badgeCode;
    private String badgeName;
    private String description;
    private String icon;
    private String unlockedAt;

    public BadgeResponse() {}

    public BadgeResponse(String badgeCode, String badgeName, String description, String icon, String unlockedAt) {
        this.badgeCode = badgeCode;
        this.badgeName = badgeName;
        this.description = description;
        this.icon = icon;
        this.unlockedAt = unlockedAt;
    }

    public String getBadgeCode() { return badgeCode; }
    public void setBadgeCode(String badgeCode) { this.badgeCode = badgeCode; }
    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(String unlockedAt) { this.unlockedAt = unlockedAt; }
}
