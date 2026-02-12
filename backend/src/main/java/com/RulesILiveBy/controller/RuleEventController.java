package com.RulesILiveBy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.RulesILiveBy.common.ApiResponse;
import com.RulesILiveBy.dto.RuleEvent.CreateRuleEventRequestDto;
import com.RulesILiveBy.dto.RuleEvent.ListRuleEventRequest;
import com.RulesILiveBy.dto.RuleEvent.ListRuleEventsDto;
import com.RulesILiveBy.dto.RuleEvent.RuleEventDto;
import com.RulesILiveBy.dto.RuleEvent.UpdateRuleEventRequestDto;
import com.RulesILiveBy.service.RuleEventService;

@RestController
@RequestMapping("/rule-events")
public class RuleEventController {
    private RuleEventService ruleEventService;

    public RuleEventController(RuleEventService ruleEventService) {
        this.ruleEventService = ruleEventService;
    }

    @GetMapping("/")
    public ResponseEntity<Object> list(@ModelAttribute ListRuleEventRequest request) {
        try {
            ListRuleEventsDto response = ruleEventService.list(request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> list(@PathVariable String id) {
        try {
            RuleEventDto response = ruleEventService.getOne(id);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/")
    public ResponseEntity<Object> create(@RequestBody CreateRuleEventRequestDto request) {
        try {
            RuleEventDto response = ruleEventService.create(request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody UpdateRuleEventRequestDto request) {
        try {
            RuleEventDto response = ruleEventService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
