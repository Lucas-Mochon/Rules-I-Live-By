package com.RulesILiveBy.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String email;
    private String password;
    private String username;
    private boolean active;
    private String jwtToken;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
