package com.project.test.test;

import com.project.test.test.model.Gender;
import com.project.test.test.model.User;
import com.project.test.test.repository.GenderRepository;
import com.project.test.test.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;


@RunWith(SpringRunner.class)
@SpringBootTest
public class TestApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private GenderRepository genderRepository;

	@Test
	public void contextLoads() {
	}

//	@Test
//	public void insertData() {
//
//		Gender undefinedGender = new Gender();
//		undefinedGender.setGenderId(0);
//		undefinedGender.setGenderName("Undefined");
//		genderRepository.save(undefinedGender);
//
//		Gender maleGender = new Gender();
//		maleGender.setGenderId(1);
//		maleGender.setGenderName("Male");
//		genderRepository.save(maleGender);
//
//		Gender femaleGender = new Gender();
//		femaleGender.setGenderId(2);
//		femaleGender.setGenderName("Female");
//		genderRepository.save(femaleGender);
//
//		User tom = new User();
//		tom.setFirstName("Tom");
//		tom.setLastName("Jones");
//		tom.setBirthDay(new Date("03.10.1980"));
//		tom.setGender(maleGender);
//		userRepository.save(tom);
//
//		User marina = new User();
//		marina.setFirstName("Marina");
//		marina.setLastName("Jones");
//		marina.setBirthDay(new Date("23.02.1985"));
//		marina.setGender(femaleGender);
//		userRepository.save(marina);
//	}
}
