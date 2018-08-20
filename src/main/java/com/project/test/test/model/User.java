package com.project.test.test.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Calendar;

@Entity
@Table(name = "users", schema="public")
public class User implements Serializable {

    private long userId;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    @JsonFormat(pattern = "YYYY-MM-dd")
    private Calendar birthDay;

    @Column
    private String gender;

    public User() {
    }
    public User(String firstName, String lastName, Calendar birthDay, String gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDay = birthDay;
        this.gender = gender;
    }

    @Id
    @SequenceGenerator(name="pk_sequence",sequenceName="entity_id_seq", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE,generator="pk_sequence")
    @Column(name="id", unique=true, nullable=false)
    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Calendar getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(Calendar birthDay) {
        this.birthDay = birthDay;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @Override
    public String toString() {
        return "User{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", birthDay=" + birthDay +
                ", gender=" + gender +
                '}';
    }
}

