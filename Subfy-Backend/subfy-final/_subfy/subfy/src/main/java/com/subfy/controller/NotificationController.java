package com.subfy.controller;

import com.subfy.service.NotificationScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationScheduler notificationScheduler;

    @PostMapping("/send")
    public ResponseEntity<String> enviarNotificacoes() {
        notificationScheduler.verificarVencimentos();
        return ResponseEntity.ok("Notificações enviadas com sucesso!");
    }
}
