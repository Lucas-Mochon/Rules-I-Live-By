package com.RulesILiveBy.dto.RuleEvent;

import java.util.Optional;

import com.RulesILiveBy.types.EventTypeEnum;

import lombok.Data;

@Data
public class UpdateRuleEventRequestDto {
    private Optional<EventTypeEnum> type;
    private Optional<String> context;
    private Optional<String> emotion;
    private Optional<String> note;
}
