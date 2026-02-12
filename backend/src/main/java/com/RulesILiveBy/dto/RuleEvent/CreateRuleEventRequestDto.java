package com.RulesILiveBy.dto.RuleEvent;

import com.RulesILiveBy.types.EventTypeEnum;

import lombok.Data;

@Data
public class CreateRuleEventRequestDto {
    private String userId;
    private String ruleId;
    private EventTypeEnum type;
    private String context;
    private String emotion;
    private String note;
}
