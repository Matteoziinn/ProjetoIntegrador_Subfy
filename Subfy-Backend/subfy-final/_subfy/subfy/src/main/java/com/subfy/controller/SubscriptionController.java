package com.subfy.controller;

import com.subfy.entity.Subscription;
import com.subfy.repository.SubscriptionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    // BUSCAR TODAS
    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    // BUSCAR POR EMAIL
    @GetMapping("/{email}")
    public List<Subscription> getSubscriptionsByUser(
            @PathVariable String email
    ) {
        return subscriptionRepository.findByUserEmail(email);
    }

    // CRIAR ASSINATURA
    @PostMapping
    public Subscription createSubscription(
            @RequestBody Subscription subscription
    ) {

        // garante status padrão
        if (subscription.getStatus() == null ||
                subscription.getStatus().isEmpty()) {

            subscription.setStatus("ATIVA");
        }

        return subscriptionRepository.save(subscription);
    }

    // ATUALIZAR ASSINATURA
    @PutMapping("/{id}")
    public Subscription updateSubscription(
            @PathVariable Long id,
            @RequestBody Subscription updatedSubscription
    ) {

        Subscription subscription =
                subscriptionRepository.findById(id).orElse(null);

        if (subscription != null) {

            subscription.setServiceName(
                    updatedSubscription.getServiceName()
            );

            subscription.setPrice(
                    updatedSubscription.getPrice()
            );

            subscription.setBillingDate(
                    updatedSubscription.getBillingDate()
            );

            // ISSO FALTAVA
            subscription.setStatus(
                    updatedSubscription.getStatus()
            );

            // mantém dono da assinatura
            subscription.setUserEmail(
                    updatedSubscription.getUserEmail()
            );

            return subscriptionRepository.save(subscription);
        }

        return null;
    }

    // DELETAR ASSINATURA
    @DeleteMapping("/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        subscriptionRepository.deleteById(id);
    }
}
