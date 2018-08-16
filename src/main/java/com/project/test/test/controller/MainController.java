package com.project.test.test.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    @RequestMapping("/")
    String home() {
        return "index";
    }

    @RequestMapping("/welcome")
    public String firstPage(ModelMap map) {
        return "welcome";
    }
}
