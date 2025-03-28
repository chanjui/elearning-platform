package com.elearning.common.config;


public class SecurityConstants {
    // 인증이 필요없는 컨트롤러 api/... 정의 
    public static final String[] PUBLIC_URLS = {
        "/api/user/login",
        "/api/user/join",
        "/api/user/logout",
        "/api/user/select",
        "/api/courses/**",     
        "/api/categories/**"   
    };

    // 인증이 필요한  컨트롤러 api/... 정의 
    public static final String[] PROTECTED_URLS = {
        "/api/user/profile/**",
        "/api/user/settings/**",
        "/api/enrollments/**",
        "/api/payments/**"
    };
} 