package com.RulesILiveBy.dto.RuleEvent;

import java.util.List;

import lombok.Data;

@Data
public class ListRuleEventsDto {
    private List<RuleEventDto> rules;
    private Integer page;
    private Integer size;
    private Integer offset;
    private Integer totalElements;
}
