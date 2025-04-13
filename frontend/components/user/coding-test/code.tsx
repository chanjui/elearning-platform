export const codeTemplates = {
    JAVASCRIPT: `function solution(nums, target) {
    // 여기에 코드를 작성하세요
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      
      if (map.has(complement)) {
        return [map.get(complement), i];
      }
      
      map.set(nums[i], i);
    }
    
    return [];
  }`,
  
    PYTHON: `def solution(nums, target):
      # 여기에 코드를 작성하세요
      num_dict = {}
      
      for i, num in enumerate(nums):
          complement = target - num
          
          if complement in num_dict:
              return [num_dict[complement], i]
              
          num_dict[num] = i
      
      return []`,
  
    JAVA: `public class Main {
      public static int[] solution(int[] nums, int target) {
          // 여기에 코드를 작성하세요
          Map<Integer, Integer> map = new HashMap<>();
          
          for (int i = 0; i < nums.length; i++) {
              int complement = target - nums[i];
              
              if (map.containsKey(complement)) {
                  return new int[] { map.get(complement), i };
              }
              
              map.put(nums[i], i);
          }
          
          return new int[] {};
      }
  
      public static void main(String[] args) {
          // 메인 메서드는 제출 시 자동으로 생성됩니다.
      }
  }`,
  
    C: `#include <stdio.h>
  #include <stdlib.h>
  
  int* solution(int* nums, int numsSize, int target, int* returnSize) {
      // 여기에 코드를 작성하세요
      int* result = (int*)malloc(2 * sizeof(int));
      *returnSize = 2;
      
      for (int i = 0; i < numsSize; i++) {
          for (int j = i + 1; j < numsSize; j++) {
              if (nums[i] + nums[j] == target) {
                  result[0] = i;
                  result[1] = j;
                  return result;
              }
          }
      }
      
      result[0] = -1;
      result[1] = -1;
      return result;
  }`
  }