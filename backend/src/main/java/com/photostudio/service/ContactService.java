package com.photostudio.service;

import com.photostudio.dto.contacts.ContactRequest;
import com.photostudio.dto.contacts.ContactResponse;

import java.util.List;

public interface ContactService {

    List<ContactResponse> findAll();

    ContactResponse findById(Long id);

    ContactResponse create(ContactRequest request);

    ContactResponse updateStatus(Long id, String status, String replyMessage);

    void delete(Long id);
}
