package com.velora.markets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.LoginRequest;
import com.velora.markets.dto.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Health endpoint returns UP")
    void healthCheck() throws Exception {
        mockMvc.perform(get("/actuator/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    @DisplayName("CORS preflight from Cloudflare Pages origin is allowed")
    void corsPreflightCloudflare() throws Exception {
        mockMvc.perform(options("/api/v1/auth/register")
                .header("Origin", "https://velora-markets.pages.dev")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "Content-Type,Authorization"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "https://velora-markets.pages.dev"))
            .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    @DisplayName("User can register and login successfully")
    void registerAndLoginFlow() throws Exception {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setFullName("Test User");
        registerReq.setUsername("testuser123");
        registerReq.setEmail("testuser123@example.com");
        registerReq.setPassword("P@ssword123");
        registerReq.setCountry("United States");
        registerReq.setCurrency("USD");

        mockMvc.perform(post("/api/v1/auth/register")
                .header("Origin", "https://velora-markets.pages.dev")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value("testuser123@example.com"))
            .andExpect(jsonPath("$.username").value("testuser123"))
            .andExpect(jsonPath("$.token").isString())
            .andExpect(jsonPath("$.tokenType").value("Bearer"));

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("testuser123@example.com");
        loginReq.setPassword("P@ssword123");

        mockMvc.perform(post("/api/v1/auth/login")
                .header("Origin", "https://velora-markets.pages.dev")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isString())
            .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }
}
