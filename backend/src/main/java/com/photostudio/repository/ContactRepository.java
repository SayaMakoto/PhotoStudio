package com.photostudio.repository;

import com.photostudio.model.contacts.Contact;
import com.photostudio.model.contacts.ContactStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByStatusOrderByCreatedAtDesc(ContactStatus status);

    List<Contact> findAllByOrderByCreatedAtDesc();
}
