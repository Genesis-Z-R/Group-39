package com.example.BACKEND_APIS.Controller;

import com.example.BACKEND_APIS.Dto.AnswerRequest;
import com.example.BACKEND_APIS.Dto.AnswerResponse;
import com.example.BACKEND_APIS.Model.Answer;
import com.example.BACKEND_APIS.Model.Question;
import com.example.BACKEND_APIS.Model.User;
import com.example.BACKEND_APIS.Model.VoteType;
import com.example.BACKEND_APIS.Repository.AnswerRepository;
import com.example.BACKEND_APIS.Repository.UserRepository;
import com.example.BACKEND_APIS.Repository.QuestionRepository;
import com.example.BACKEND_APIS.Service.AnswerServices;
import com.example.BACKEND_APIS.Service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/answers")
public class AnswerController {

    @Autowired
    private VoteService voteService;

    @Autowired
    private AnswerServices answerService;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping
    public ResponseEntity<AnswerResponse> postAnswer(@RequestBody AnswerRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = new Answer();
        answer.setContent(request.getContent());
        answer.setUser(user);
        answer.setQuestion(question);

        Answer saved = answerRepository.save(answer);

        return ResponseEntity.ok(new AnswerResponse(
                saved.getId(),
                saved.getContent(),
                user.getName(),
                saved.getUpvotes(),
                saved.getDownvotes()
        ));
    }


//    @PutMapping("/{id}/upvote")
//    public ResponseEntity<?> upvote(@PathVariable Long id, @RequestParam Long userId) {
//        Answer answer = answerRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Answer not found"));
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Optional<Vote> existingVote = voteRepository.findByUserIdAndAnswerId(userId, id);
//        if (existingVote.isPresent()) {
//            return ResponseEntity.badRequest().body("You already voted on this answer.");
//        }
//
//        answer.setUpvotes(answer.getUpvotes() + 1);
//        answerRepository.save(answer);
//
//        Vote vote = new Vote(user, answer, "UPVOTE");
//        voteRepository.save(vote);
//
//        return ResponseEntity.ok("Answer upvoted successfully.");
//    }
//
//    @PutMapping("/{id}/downvote")
//    public ResponseEntity<?> downvote(@PathVariable Long id, @RequestParam Long userId) {
//        Answer answer = answerRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Answer not found"));
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Optional<Vote> existingVote = voteRepository.findByUserIdAndAnswerId(userId, id);
//        if (existingVote.isPresent()) {
//            return ResponseEntity.badRequest().body("You already voted on this answer.");
//        }
//
//        answer.setDownvotes(answer.getDownvotes() + 1);
//        answerRepository.save(answer);
//
//        Vote vote = new Vote(user, answer, "DOWNVOTE");
//        voteRepository.save(vote);
//
//        return ResponseEntity.ok("Answer downvoted successfully.");
//    }



    @GetMapping("/question/{questionId}")
    public List<AnswerResponse> getAnswersByQuestion(@PathVariable Long questionId) {
        return answerRepository.findByQuestionId(questionId).stream()
                .map(a -> new AnswerResponse(
                        a.getId(),
                        a.getContent(),
                        a.getUser().getName(),
                        a.getUpvotes(),
                        a.getDownvotes()
                ))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public Answer updateAnswer(@PathVariable Long id, @RequestBody Answer answerDetails) {
        return answerService.updateAnswer(id, answerDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteAnswer(@PathVariable Long id) {
        answerService.deleteAnswer(id);
    }

    @GetMapping("/question/{questionId}/paged")
    public Page<Answer> getPaginatedAnswersByQuestion(
            @PathVariable Long questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return answerService.getPaginatedAnswersByQuestion(questionId, pageable);
    }

    @PostMapping("/{answerId}/vote")
    public ResponseEntity<String> voteOnAnswer(
            @PathVariable Long answerId,
            @RequestParam Long userId,
            @RequestParam VoteType voteType) {
        voteService.vote(answerId, userId, voteType);
        return ResponseEntity.ok("Vote registered");
    }
}