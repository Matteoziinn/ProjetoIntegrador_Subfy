package com.subfy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void enviarAlertaVencimento(String destinatario, String nomeServico, int diasRestantes, double preco) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(destinatario);

            String assunto = diasRestantes == 0
                ? "🔴 Subfy — " + nomeServico + " vence HOJE!"
                : "🟡 Subfy — " + nomeServico + " vence em " + diasRestantes + " dia(s)";

            String labelDia = diasRestantes == 0
                ? "vence <strong>hoje</strong>"
                : "vence em <strong>" + diasRestantes + " dia(s)</strong>";

            String precoFormatado = String.format("%.2f", preco).replace(".", ",");

            String corpo = "<!DOCTYPE html>" +
                "<html><body>" +
                "<div style='font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f0edf8;padding:32px 16px;'>" +

                "  <div style='background:linear-gradient(135deg,#6d28d9,#a855f7,#e11d48);border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;'>" +
                "    <h1 style='color:#fff;font-size:28px;font-weight:900;margin:0;letter-spacing:-1px;'>Subfy</h1>" +
                "    <p style='color:rgba(255,255,255,0.8);font-size:14px;margin:8px 0 0;'>Gerenciador de Assinaturas</p>" +
                "  </div>" +

                "  <div style='background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(109,40,217,0.08);'>" +
                "    <h2 style='color:#1c1033;font-size:20px;font-weight:800;margin:0 0 8px;'>⏰ Lembrete de assinatura</h2>" +
                "    <p style='color:#6b5f8a;font-size:15px;margin:0 0 20px;'>Sua assinatura do <strong style=\"color:#6d28d9;\">" + nomeServico + "</strong> " + labelDia + ".</p>" +

                "    <div style='background:#f7f5fd;border-radius:12px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #6d28d9;'>" +
                "      <div style='font-size:12px;color:#6b5f8a;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;'>Valor a ser cobrado</div>" +
                "      <div style='font-size:28px;font-weight:900;color:#1c1033;letter-spacing:-1px;'>R$ " + precoFormatado + "</div>" +
                "    </div>" +

                "    <div style='background:#fef3c7;border-radius:10px;padding:12px 16px;margin-bottom:20px;'>" +
                "      <p style='color:#92400e;font-size:13px;margin:0;'>" +
                "        💡 <strong>Dica:</strong> Acesse o Subfy para gerenciar suas assinaturas e evitar cobranças indesejadas." +
                "      </p>" +
                "    </div>" +

                "    <p style='color:#b0a8c8;font-size:12px;margin:0;text-align:center;'>" +
                "      Você recebeu este email pois tem alertas de vencimento ativos no Subfy.<br>" +
                "      Este é um email automático, não responda." +
                "    </p>" +
                "  </div>" +

                "  <p style='text-align:center;color:#b0a8c8;font-size:11px;margin-top:16px;'>© 2025 Subfy · Gerenciador de Assinaturas</p>" +
                "</div>" +
                "</body></html>";

            helper.setSubject(assunto);
            helper.setText(corpo, true);
            mailSender.send(message);

            System.out.println("✅ Email enviado para: " + destinatario + " | " + nomeServico);

        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar email para " + destinatario + ": " + e.getMessage());
        }
    }
}
