package com.elearning.course.controller;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// @CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping("/upload-url")
    public Map<String, String> generatePresignedUrl(@RequestBody Map<String, String> request) {
        String fileName = request.get("fileName");
        String fileType = request.get("fileType");

        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 5); // 5분 유효

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, fileName)
                .withMethod(HttpMethod.PUT)
                .withExpiration(expiration);
        generatePresignedUrlRequest.setContentType(fileType);

        URL uploadUrl = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        String fileUrl = amazonS3.getUrl(bucket, fileName).toString();

        Map<String, String> result = new HashMap<>();
        result.put("uploadUrl", uploadUrl.toString());
        result.put("fileUrl", fileUrl);
        return result;
    }
}