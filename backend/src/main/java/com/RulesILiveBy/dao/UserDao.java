package com.RulesILiveBy.dao;

import com.RulesILiveBy.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserDao extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
