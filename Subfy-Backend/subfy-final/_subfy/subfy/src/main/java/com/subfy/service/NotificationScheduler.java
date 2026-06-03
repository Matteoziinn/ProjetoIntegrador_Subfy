package com.subfy.service;

import com.subfy.entity.Subscription;
import com.subfy.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
public class NotificationScheduler {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private EmailService emailService;

    // Roda automaticamente todo dia às 08:00
    @Scheduled(cron = "0 0 8 * * *")
    public void verificarVencimentos() {
        System.out.println("🔔 Verificando vencimentos para envio de email...");

        LocalDate hoje = LocalDate.now();
        int diaHoje   = hoje.getDayOfMonth();
        int diasNoMes = hoje.getMonth().length(hoje.isLeapYear());

        List<Subscription> todas = subscriptionRepository.findAll();

        for (Subscription sub : todas) {

            if (sub.getStatus() == null || sub.getStatus().equals("CANCELADA")) continue;
            if (sub.getUserEmail() == null || sub.getUserEmail().isEmpty()) continue;

            int diaBilling = sub.getBillingDate();
            int diff       = diaBilling - diaHoje;
            if (diff < 0) diff += diasNoMes;

            if (diff == 0 || diff == 1 || diff == 3) {
                emailService.enviarAlertaVencimento(
                    sub.getUserEmail(),
                    sub.getServiceName(),
                    diff,
                    sub.getPrice()
                );
            }
        }

        System.out.println("✅ Verificação concluída.");
    }
}
