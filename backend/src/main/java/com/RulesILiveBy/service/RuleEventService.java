package com.RulesILiveBy.service;

import org.springframework.stereotype.Service;

import com.RulesILiveBy.dao.RuleEventDao;
import com.RulesILiveBy.dto.RuleEvent.CreateRuleEventRequestDto;
import com.RulesILiveBy.dto.RuleEvent.ListRuleEventRequest;
import com.RulesILiveBy.dto.RuleEvent.ListRuleEventsDto;
import com.RulesILiveBy.dto.RuleEvent.RuleEventDto;
import com.RulesILiveBy.dto.RuleEvent.UpdateRuleEventRequestDto;

@Service
public class RuleEventService {
    private final RuleEventDao ruleEventDao;

    public RuleEventService(RuleEventDao ruleEventDao) {
        this.ruleEventDao = ruleEventDao;
    }

    public ListRuleEventsDto list(ListRuleEventRequest request) {
        return ruleEventDao.list(request);
    }

    public RuleEventDto getOne(String id) {
        return ruleEventDao.getOne(id);
    }

    public RuleEventDto create(CreateRuleEventRequestDto request) {
        return ruleEventDao.create(request);
    }

    public RuleEventDto update(String id, UpdateRuleEventRequestDto request) {
        return ruleEventDao.update(id, request);
    }
}
