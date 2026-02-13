package com.RulesILiveBy.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.RulesILiveBy.entity.RuleEvent;
import com.RulesILiveBy.types.EventTypeEnum;

@Repository
public interface RuleEventRepository extends MongoRepository<RuleEvent, String> {

        List<RuleEvent> findByUserId(String userId);

        List<RuleEvent> findByUserIdAndType(String userId, EventTypeEnum type);

        List<RuleEvent> findByUserIdAndOccurredAtBetween(
                        String userId,
                        LocalDateTime fromDate,
                        LocalDateTime toDate);

        List<RuleEvent> findByUserIdAndTypeAndOccurredAtBetween(
                        String userId,
                        EventTypeEnum type,
                        LocalDateTime fromDate,
                        LocalDateTime toDate);

        List<RuleEvent> findByRuleIdAndType(String ruleId, EventTypeEnum type);

        List<RuleEvent> findByRuleId(String ruleId);
}
