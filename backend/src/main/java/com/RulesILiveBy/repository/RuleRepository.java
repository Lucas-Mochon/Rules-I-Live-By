package com.RulesILiveBy.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.RulesILiveBy.entity.Rule;
import com.RulesILiveBy.types.RuleStatusEnum;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RuleRepository extends MongoRepository<Rule, String> {

        List<Rule> findByUserId(String userId);

        List<Rule> findByUserIdAndStatus(String userId, RuleStatusEnum status);

        List<Rule> findByUserIdAndCreatedAtBetween(
                        String userId,
                        LocalDateTime fromDate,
                        LocalDateTime toDate);

        List<Rule> findByUserIdAndStatusAndCreatedAtBetween(
                        String userId,
                        RuleStatusEnum status,
                        LocalDateTime fromDate,
                        LocalDateTime toDate);
}
