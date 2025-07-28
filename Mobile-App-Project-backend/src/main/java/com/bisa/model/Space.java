package com.bisa.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
public class Space {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    @ManyToMany
    @JoinTable(
        name = "user_space_membership",
        joinColumns = @JoinColumn(name = "space_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members;

    public Space() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }
} 