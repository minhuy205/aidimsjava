package com.aidims.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;

    private String username;
    private String full_name;
    private String email;
    private String phone;

    // getter + setter
}
