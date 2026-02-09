package com.RulesILiveBy.migration;

import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;

@ChangeUnit(id = "001", author = "admin", order = "1", transactional = false)
public class V001__InitialSetup {

    @Execution
    public void execution(MongoTemplate mongoTemplate) {
        mongoTemplate.createCollection("users");
        mongoTemplate.createCollection("rules");
        mongoTemplate.createCollection("ruleEvents");

        System.out.println("Migration V001 executed");
    }

    @RollbackExecution
    public void rollback(MongoTemplate mongoTemplate) {
        mongoTemplate.dropCollection("users");
        mongoTemplate.dropCollection("rules");
        mongoTemplate.dropCollection("ruleEvents");
        System.out.println("Migration V001 rolled back");
    }
}
