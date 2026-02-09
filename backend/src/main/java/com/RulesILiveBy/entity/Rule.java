package com.RulesILiveBy.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.RulesILiveBy.types.RuleStatusEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rules")
public class Rule {

    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private RuleStatusEnum status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}