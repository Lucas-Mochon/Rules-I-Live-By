package com.RulesILiveBy.dto.RuleEvent;

import java.time.LocalDateTime;
import java.util.Optional;

import com.RulesILiveBy.types.EventTypeEnum;

import lombok.Data;

@Data
public class ListRuleEventRequest {
    private String userId;
    private EventTypeEnum type;
    private Integer page;
    private Integer size;
    private Integer offset;
    private Optional<LocalDateTime> fromDate = Optional.empty();
    private Optional<LocalDateTime> toDate = Optional.empty();
}
