package com.bisa.controller;

import com.bisa.model.Space;
import com.bisa.repository.SpaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {
    private final SpaceRepository spaceRepository;
    public SpaceController(SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }

    @GetMapping
    public List<Space> getAllSpaces() {
        return spaceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Space> getSpaceById(@PathVariable Long id) {
        return spaceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Space createSpace(@RequestBody Space space) {
        return spaceRepository.save(space);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Space> updateSpace(@PathVariable Long id, @RequestBody Space spaceDetails) {
        Optional<Space> spaceOpt = spaceRepository.findById(id);
        if (spaceOpt.isEmpty()) return ResponseEntity.notFound().build();
        Space space = spaceOpt.get();
        space.setName(spaceDetails.getName());
        space.setDescription(spaceDetails.getDescription());
        space.setMembers(spaceDetails.getMembers());
        return ResponseEntity.ok(spaceRepository.save(space));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long id) {
        if (!spaceRepository.existsById(id)) return ResponseEntity.notFound().build();
        spaceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 