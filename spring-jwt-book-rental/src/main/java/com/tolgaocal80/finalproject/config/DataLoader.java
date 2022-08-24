package com.tolgaocal80.finalproject.config;

import com.tolgaocal80.finalproject.entity.Role;
import com.tolgaocal80.finalproject.repository.RoleRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    private final RoleRepository roleRepository;


    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        var userRoleExists = roleRepository.existsByName(ROLE_USER);

        if(!userRoleExists){
            var userRole = new Role();
            userRole.setName(ROLE_USER);
            roleRepository.save(userRole);
        }

        var adminRoleExists = roleRepository.existsByName(ROLE_ADMIN);

        if(!adminRoleExists){
            var adminRole = new Role();
            adminRole.setName(ROLE_ADMIN);
            roleRepository.save(adminRole);
        }



    }



}
