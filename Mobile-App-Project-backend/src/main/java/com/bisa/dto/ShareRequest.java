package com.bisa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ShareRequest {
    @JsonProperty("share_type")
    private String shareType;
    
    @JsonProperty("platform")
    private String platform;
    
    @JsonProperty("user_agent")
    private String userAgent;

    public ShareRequest() {}

    public ShareRequest(String shareType, String platform, String userAgent) {
        this.shareType = shareType;
        this.platform = platform;
        this.userAgent = userAgent;
    }

    public String getShareType() { return shareType; }
    public void setShareType(String shareType) { this.shareType = shareType; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
} 