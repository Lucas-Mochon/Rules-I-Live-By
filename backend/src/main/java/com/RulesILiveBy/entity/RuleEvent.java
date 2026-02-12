package com.RulesILiveBy.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.RulesILiveBy.types.EventTypeEnum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ruleEvents")
public class RuleEvent {

    @Id
    private String id;
    private String userId;
    private String ruleId;
    private EventTypeEnum type;
    private String context;
    private String emotion;
    private String note;
    private LocalDateTime occurredAt;
}