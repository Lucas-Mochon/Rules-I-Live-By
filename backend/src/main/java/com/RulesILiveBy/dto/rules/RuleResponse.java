package com.RulesILiveBy.dto.rules;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import com.RulesILiveBy.types.RuleStatusEnum;

import lombok.Data;

@Data
public class RuleResponse {
    @Id
    private String id;
    private String title;
    private String description;
    private RuleStatusEnum status;
    private LocalDateTime createdAt;
}
