package com.RulesILiveBy.dto.rules;

import java.util.List;

import lombok.Data;

@Data

public class ListRulesResponse {

    private List<RuleResponse> rules;
    private Integer page;
    private Integer size;
    private Integer offset;
    private Integer totalElements;
}
