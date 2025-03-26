package com.elearning.controller.user;        


import com.elearning.domain.Course;
import com.elearning.domain.User;
import com.elearning.repository.instructor.CourseRepository;
import com.elearning.repository.user.UserRepisitory;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*") // CORS 허용 (프론트엔드와 포트가 다를 경우 필요)
public class CourseController {

    private final CourseRepository courseRepository;
    private final UserRepisitory userRepository;

    public CourseController(CourseRepository courseRepository, UserRepisitory userRepository) {    
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public Map<String, Object> getAllCourses() {
        System.out.println("getAllCourses 호출됨");
        List<Course> courses = courseRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("courses", courses);
        return response;
    }

    @GetMapping("user")
    public Map<String, Object> getUserCourses() {
        List<User> courses = userRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("courses", courses);
        return response;
    }
    
    
}
