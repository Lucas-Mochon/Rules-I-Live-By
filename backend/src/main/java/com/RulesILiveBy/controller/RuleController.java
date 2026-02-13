package com.RulesILiveBy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.RulesILiveBy.common.ApiResponse;
import com.RulesILiveBy.dto.rules.CreateRuleRequestDto;
import com.RulesILiveBy.dto.rules.EditRuleRequestDto;
import com.RulesILiveBy.dto.rules.ListRequestDto;
import com.RulesILiveBy.dto.rules.ListRulesResponse;
import com.RulesILiveBy.dto.rules.RuleResponse;
import com.RulesILiveBy.dto.rules.StatsRespectedDto;
import com.RulesILiveBy.service.RuleService;

@RestController
@RequestMapping("/rules")
public class RuleController {
    private final RuleService ruleService;

    public RuleController(RuleService ruleService) {
        this.ruleService = ruleService;
    }

    @GetMapping("/")
    public ResponseEntity<Object> list(@ModelAttribute ListRequestDto request) {
        try {
            ListRulesResponse response = ruleService.list(request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOne(@PathVariable String id) {
        try {
            RuleResponse reponse = ruleService.getOne(id);
            return ResponseEntity.ok(ApiResponse.success(reponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/most-broken/{userId}")
    public ResponseEntity<Object> mostBroken(@PathVariable String userId) {
        try {
            RuleResponse response = ruleService.mostBroken(userId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/most-respected/{userId}")
    public ResponseEntity<Object> mostRespected(@PathVariable String userId) {
        try {
            RuleResponse response = ruleService.mostRespected(userId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/stats/respected/{userId}")
    public ResponseEntity<Object> getMethodName(@PathVariable String userId) {
        try {
            StatsRespectedDto response = ruleService.statsRespected(userId);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/")
    public ResponseEntity<Object> create(@RequestBody CreateRuleRequestDto request) {
        try {
            RuleResponse reponse = ruleService.create(request);
            return ResponseEntity.ok(ApiResponse.success(reponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody EditRuleRequestDto request) {
        try {
            RuleResponse reponse = ruleService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success(reponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<Object> archive(@PathVariable String id) {
        try {
            RuleResponse reponse = ruleService.archive(id);
            return ResponseEntity.ok(ApiResponse.success(reponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
