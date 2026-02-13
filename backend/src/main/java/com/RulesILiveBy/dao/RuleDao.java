package com.RulesILiveBy.dao;

import org.springframework.stereotype.Component;

import com.RulesILiveBy.dto.rules.CreateRuleRequestDto;
import com.RulesILiveBy.dto.rules.EditRuleRequestDto;
import com.RulesILiveBy.dto.rules.ListRequestDto;
import com.RulesILiveBy.dto.rules.ListRulesResponse;
import com.RulesILiveBy.dto.rules.RuleResponse;
import com.RulesILiveBy.dto.rules.StatsRespectedDto;
import com.RulesILiveBy.entity.Rule;
import com.RulesILiveBy.entity.RuleEvent;
import com.RulesILiveBy.repository.RuleEventRepository;
import com.RulesILiveBy.repository.RuleRepository;
import com.RulesILiveBy.types.EventTypeEnum;
import com.RulesILiveBy.types.RuleStatusEnum;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RuleDao {
    private final RuleRepository ruleRepository;
    private final RuleEventRepository ruleEventRepository;

    public RuleDao(RuleRepository ruleRepository, RuleEventRepository ruleEventRepository) {
        this.ruleRepository = ruleRepository;
        this.ruleEventRepository = ruleEventRepository;
    }

    public ListRulesResponse list(ListRequestDto request) {
        List<Rule> rules = getRulesByFilters(request);

        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 10;
        int offset = request.getOffset() != null ? request.getOffset() : 0;

        if (page > 0) {
            page = page - 1;
        }

        int startIndex = (page * size);
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

    public RuleResponse mostBroken(String userId) {
        List<Rule> userRules = ruleRepository.findByUserId(userId);

        if (userRules.isEmpty()) {
            throw new RuntimeException("Aucune règle trouvée pour cet utilisateur");
        }

        Rule mostBrokenRule = userRules.stream()
                .max((rule1, rule2) -> {
                    long brokenCount1 = ruleEventRepository
                            .findByRuleIdAndType(rule1.getId(), EventTypeEnum.BROKEN)
                            .size();
                    long brokenCount2 = ruleEventRepository
                            .findByRuleIdAndType(rule2.getId(), EventTypeEnum.BROKEN)
                            .size();
                    return Long.compare(brokenCount1, brokenCount2);
                })
                .orElseThrow(() -> new RuntimeException("Impossible de déterminer la règle la plus brisée"));

        return mapToRuleResponse(mostBrokenRule);
    }

    public RuleResponse mostRespected(String userId) {
        List<Rule> userRules = ruleRepository.findByUserId(userId);

        if (userRules.isEmpty()) {
            throw new RuntimeException("Aucune règle trouvée pour cet utilisateur");
        }

        Rule mostRespectedRule = userRules.stream()
                .max((rule1, rule2) -> {
                    long respectedCount1 = ruleEventRepository
                            .findByRuleIdAndType(rule1.getId(), EventTypeEnum.RESPECTED)
                            .size();
                    long respectedCount2 = ruleEventRepository
                            .findByRuleIdAndType(rule2.getId(), EventTypeEnum.RESPECTED)
                            .size();
                    return Long.compare(respectedCount1, respectedCount2);
                })
                .orElseThrow(() -> new RuntimeException("Impossible de déterminer la règle la plus respectée"));

        return mapToRuleResponse(mostRespectedRule);
    }

    public StatsRespectedDto statsRespected(String userId) {
        List<RuleEvent> allEvents = ruleEventRepository.findByUserId(userId);

        if (allEvents.isEmpty()) {
            throw new RuntimeException("Aucun événement trouvé pour cet utilisateur");
        }

        long respectedCount = allEvents.stream()
                .filter(event -> event.getType() == EventTypeEnum.RESPECTED)
                .count();

        BigDecimal taux = BigDecimal.valueOf(respectedCount)
                .divide(BigDecimal.valueOf(allEvents.size()), 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        StatsRespectedDto response = new StatsRespectedDto();
        response.setTaux(taux);

        return response;
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
