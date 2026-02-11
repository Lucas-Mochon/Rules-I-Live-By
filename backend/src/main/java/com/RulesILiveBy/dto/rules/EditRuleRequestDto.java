package com.RulesILiveBy.dto.rules;

import java.util.Optional;

import lombok.Data;

@Data
public class EditRuleRequestDto {
    private Optional<String> title = Optional.empty();;
    private Optional<String> description = Optional.empty();
}
