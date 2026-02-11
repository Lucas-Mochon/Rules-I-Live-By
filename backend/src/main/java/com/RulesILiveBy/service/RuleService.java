package com.RulesILiveBy.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.RulesILiveBy.dao.RuleDao;
import com.RulesILiveBy.dto.rules.CreateRuleRequestDto;
import com.RulesILiveBy.dto.rules.EditRuleRequestDto;
import com.RulesILiveBy.dto.rules.ListRequestDto;
import com.RulesILiveBy.dto.rules.ListRulesResponse;
import com.RulesILiveBy.dto.rules.RuleResponse;
import com.RulesILiveBy.utils.JwtUtil;

@Service
public class RuleService {
    private final RuleDao ruleDao;

    public RuleService(RuleDao ruleDao, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.ruleDao = ruleDao;
    }

    @Transactional
    public ListRulesResponse list(ListRequestDto request) {
        return ruleDao.list(request);
    }

    @Transactional
    public RuleResponse getOne(String id) {
        return ruleDao.getOne(id);
    }

    @Transactional
    public RuleResponse create(CreateRuleRequestDto request) {
        return ruleDao.create(request);
    }

    @Transactional
    public RuleResponse update(String id, EditRuleRequestDto request) {
        return ruleDao.update(id, request);
    }

    @Transactional
    public RuleResponse archive(String id) {
        return ruleDao.archive(id);
    }
}
