package com.elearning.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResultData<T> {

  private int totalCount;
  private String msg;
  private T data;

  public static<T> ResultData<T> of (int totalCount, String msg, T data) {
    return new ResultData<T>(totalCount, msg, data);
  }

  public static<T> ResultData<T> of (int totalCount, String msg) { return of(totalCount, msg, null); }
}