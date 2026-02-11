package com.RulesILiveBy.dto.rules;

import java.time.LocalDateTime;
import java.util.Optional;

import com.RulesILiveBy.types.RuleStatusEnum;

import lombok.Data;

@Data
public class ListRequestDto {
    private String userId;
    private Integer page;
    private Integer size;
    private Integer offset;
    private Optional<RuleStatusEnum> status = Optional.empty();
    private Optional<LocalDateTime> fromDate = Optional.empty();
    private Optional<LocalDateTime> toDate = Optional.empty();
}
