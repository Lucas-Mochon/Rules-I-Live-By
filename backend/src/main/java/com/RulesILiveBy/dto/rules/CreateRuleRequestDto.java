package com.RulesILiveBy.dto.rules;

import lombok.Data;

@Data
public class CreateRuleRequestDto {
    private String userId;
    private String title;
    private String description;
}
