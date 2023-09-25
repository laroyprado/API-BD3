package com.example.API3SEM.controllers;

import com.example.API3SEM.resultCenter.CenterResult;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CenterResultWithMembersDTO {
    private CenterResult centerResult;
    private List<MemberDTO> members;
}