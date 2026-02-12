package com.RulesILiveBy.dto.RuleEvent;

import java.time.LocalDateTime;

import com.RulesILiveBy.dto.rules.RuleResponse;
import com.RulesILiveBy.types.EventTypeEnum;

import lombok.Data;

@Data
public class RuleEventDto {
    private String id;
    private RuleResponse rule;
    private EventTypeEnum type;
    private String context;
    private String emotion;
    private String note;
    private LocalDateTime occuredAt;
}
