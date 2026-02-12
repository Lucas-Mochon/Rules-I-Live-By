package com.RulesILiveBy.dao;

import org.springframework.stereotype.Component;

import com.RulesILiveBy.dto.RuleEvent.CreateRuleEventRequestDto;
import com.RulesILiveBy.dto.RuleEvent.ListRuleEventRequest;
import com.RulesILiveBy.dto.RuleEvent.ListRuleEventsDto;
import com.RulesILiveBy.dto.RuleEvent.RuleEventDto;
import com.RulesILiveBy.dto.RuleEvent.UpdateRuleEventRequestDto;
import com.RulesILiveBy.dto.rules.RuleResponse;
import com.RulesILiveBy.entity.RuleEvent;
import com.RulesILiveBy.repository.RuleEventRepository;
import com.RulesILiveBy.types.EventTypeEnum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RuleEventDao {
    private final RuleEventRepository ruleEventRepository;
    private final RuleDao ruleDao;

    public RuleEventDao(RuleEventRepository ruleEventRepository, RuleDao ruleDao) {
        this.ruleEventRepository = ruleEventRepository;
        this.ruleDao = ruleDao;
    }

    public ListRuleEventsDto list(ListRuleEventRequest request) {
        List<RuleEvent> events = getRuleEventsByFilters(request);

        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 10;
        int offset = request.getOffset() != null ? request.getOffset() : 0;

        if (page > 0) {
            page = page - 1;
        }

        int startIndex = (page * size);
        int endIndex = Math.min(startIndex + size, events.size());

        if (startIndex > events.size()) {
            startIndex = events.size();
        }

        List<RuleEvent> paginatedEvents = events.subList(startIndex, endIndex);

        List<RuleEventDto> eventResponses = paginatedEvents.stream()
                .map(this::mapToRuleEventDto)
                .collect(Collectors.toList());

        ListRuleEventsDto response = new ListRuleEventsDto();
        response.setRules(eventResponses);
        response.setPage(request.getPage());
        response.setSize(size);
        response.setOffset(offset);
        response.setTotalElements(events.size());

        return response;
    }

    public RuleEventDto getOne(String id) {
        RuleEvent ruleEvent = ruleEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule event not found"));
        return mapToRuleEventDto(ruleEvent);
    }

    public RuleEventDto create(CreateRuleEventRequestDto request) {
        RuleEvent ruleEvent = new RuleEvent();
        ruleEvent.setContext(request.getContext());
        ruleEvent.setEmotion(request.getEmotion());
        ruleEvent.setNote(request.getNote());
        ruleEvent.setOccurredAt(LocalDateTime.now());
        ruleEvent.setRuleId(request.getRuleId());
        ruleEvent.setType(request.getType());
        ruleEvent.setUserId(request.getUserId());
        RuleEvent savedRuleEvent = ruleEventRepository.save(ruleEvent);
        return mapToRuleEventDto(savedRuleEvent);
    }

    public RuleEventDto update(String id, UpdateRuleEventRequestDto request) {
        RuleEvent ruleEvent = ruleEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule event not found with id: " + id));

        Optional<String> context = request.getContext() != null ? request.getContext() : Optional.empty();
        Optional<String> emotion = request.getEmotion() != null ? request.getEmotion() : Optional.empty();
        Optional<String> note = request.getNote() != null ? request.getNote() : Optional.empty();
        Optional<EventTypeEnum> type = request.getType() != null ? request.getType() : Optional.empty();

        context.ifPresent(ruleEvent::setContext);
        emotion.ifPresent(ruleEvent::setEmotion);
        note.ifPresent(ruleEvent::setNote);
        type.ifPresent(ruleEvent::setType);

        RuleEvent updatedRuleEvent = ruleEventRepository.save(ruleEvent);

        return mapToRuleEventDto(updatedRuleEvent);
    }

    private List<RuleEvent> getRuleEventsByFilters(ListRuleEventRequest request) {
        String userId = request.getUserId();

        Optional<EventTypeEnum> type = request.getType() != null ? Optional.of(request.getType()) : Optional.empty();
        Optional<LocalDateTime> fromDate = request.getFromDate() != null ? request.getFromDate() : Optional.empty();
        Optional<LocalDateTime> toDate = request.getToDate() != null ? request.getToDate() : Optional.empty();

        if (type.isPresent() && fromDate.isPresent() && toDate.isPresent()) {
            return ruleEventRepository.findByUserIdAndTypeAndOccurredAtBetween(
                    userId,
                    type.get(),
                    fromDate.get(),
                    toDate.get());
        }

        if (fromDate.isPresent() && toDate.isPresent()) {
            return ruleEventRepository.findByUserIdAndOccurredAtBetween(
                    userId,
                    fromDate.get(),
                    toDate.get());
        }

        if (type.isPresent()) {
            return ruleEventRepository.findByUserIdAndType(userId, type.get());
        }

        return ruleEventRepository.findByUserId(userId);
    }

    private RuleEventDto mapToRuleEventDto(RuleEvent event) {
        RuleResponse rule = ruleDao.getOne(event.getRuleId());

        RuleEventDto dto = new RuleEventDto();
        dto.setId(event.getId());
        dto.setRule(rule);
        dto.setType(event.getType());
        dto.setContext(event.getContext());
        dto.setEmotion(event.getEmotion());
        dto.setNote(event.getNote());
        dto.setOccuredAt(event.getOccurredAt());
        return dto;
    }
}
