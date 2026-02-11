package com.RulesILiveBy.dao;

import org.springframework.stereotype.Component;

import com.RulesILiveBy.dto.rules.CreateRuleRequestDto;
import com.RulesILiveBy.dto.rules.EditRuleRequestDto;
import com.RulesILiveBy.dto.rules.ListRequestDto;
import com.RulesILiveBy.dto.rules.ListRulesResponse;
import com.RulesILiveBy.dto.rules.RuleResponse;
import com.RulesILiveBy.entity.Rule;
import com.RulesILiveBy.repository.RuleRepository;
import com.RulesILiveBy.types.RuleStatusEnum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RuleDao {
    private final RuleRepository ruleRepository;

    public RuleDao(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    public ListRulesResponse list(ListRequestDto request) {
        List<Rule> rules = getRulesByFilters(request);

        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 10;
        int offset = request.getOffset() != null ? request.getOffset() : 0;

        if (page > 0) {
            page = page - 1;
        }

        int startIndex = (page * size) + offset;
        int endIndex = Math.min(startIndex + size, rules.size());

        if (startIndex > rules.size()) {
            startIndex = rules.size();
        }

        List<Rule> paginatedRules = rules.subList(startIndex, endIndex);

        List<RuleResponse> ruleResponses = paginatedRules.stream()
                .map(this::mapToRuleResponse)
                .collect(Collectors.toList());

        ListRulesResponse response = new ListRulesResponse();
        response.setRules(ruleResponses);
        response.setPage(request.getPage());
        response.setSize(size);
        response.setOffset(offset);
        response.setTotalElements(rules.size());

        return response;
    }

    public RuleResponse getOne(String id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found with id: " + id));

        return mapToRuleResponse(rule);
    }

    public RuleResponse create(CreateRuleRequestDto request) {
        Rule rule = new Rule();
        rule.setUserId(request.getUserId());
        rule.setTitle(request.getTitle());
        rule.setDescription(request.getDescription());
        rule.setStatus(RuleStatusEnum.ACTIVE);
        rule.setCreatedAt(LocalDateTime.now());
        rule.setUpdatedAt(LocalDateTime.now());

        Rule savedRule = ruleRepository.save(rule);

        return mapToRuleResponse(savedRule);
    }

    public RuleResponse update(String id, EditRuleRequestDto request) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found with id: " + id));

        Optional<String> title = request.getTitle() != null ? request.getTitle() : Optional.empty();
        Optional<String> description = request.getDescription() != null ? request.getDescription() : Optional.empty();

        title.ifPresent(rule::setTitle);
        description.ifPresent(rule::setDescription);
        rule.setUpdatedAt(LocalDateTime.now());

        Rule updatedRule = ruleRepository.save(rule);

        return mapToRuleResponse(updatedRule);
    }

    public RuleResponse archive(String id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found with id: " + id));

        rule.setStatus(RuleStatusEnum.ARCHIVED);
        rule.setUpdatedAt(LocalDateTime.now());
        Rule archivedRule = ruleRepository.save(rule);

        return mapToRuleResponse(archivedRule);
    }

    private RuleResponse mapToRuleResponse(Rule rule) {
        RuleResponse response = new RuleResponse();
        response.setId(rule.getId());
        response.setTitle(rule.getTitle());
        response.setStatus(rule.getStatus());
        response.setDescription(rule.getDescription());
        response.setCreatedAt(rule.getCreatedAt());
        return response;
    }

    private List<Rule> getRulesByFilters(ListRequestDto request) {
        String userId = request.getUserId();

        Optional<RuleStatusEnum> status = request.getStatus() != null ? request.getStatus() : Optional.empty();
        Optional<LocalDateTime> fromDate = request.getFromDate() != null ? request.getFromDate() : Optional.empty();
        Optional<LocalDateTime> toDate = request.getToDate() != null ? request.getToDate() : Optional.empty();

        if (status.isPresent() && fromDate.isPresent() && toDate.isPresent()) {
            return ruleRepository.findByUserIdAndStatusAndCreatedAtBetween(
                    userId,
                    status.get(),
                    fromDate.get(),
                    toDate.get());
        }

        if (status.isPresent()) {
            return ruleRepository.findByUserIdAndStatus(userId, status.get());
        }

        if (fromDate.isPresent() && toDate.isPresent()) {
            return ruleRepository.findByUserIdAndCreatedAtBetween(
                    userId,
                    fromDate.get(),
                    toDate.get());
        }

        List<Rule> allRules = ruleRepository.findByUserId(userId);
        return allRules;
    }

}
