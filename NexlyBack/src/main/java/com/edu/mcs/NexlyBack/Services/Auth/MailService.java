package com.edu.mcs.NexlyBack.Services.Auth;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Encapsula el envío de correos a través de {@link JavaMailSender}.
 * En desarrollo apunta a un servidor SMTP de pruebas (Mailpit), por lo que
 * los correos no salen a Internet sino que se capturan en su bandeja web.
 */
@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final String from;

    public MailService(JavaMailSender mailSender, @Value("${app.mail.from}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    /** Envía el correo de verificación con el enlace de confirmación. */
    public void enviarVerificacion(String destino, String nombre, String enlace) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, "UTF-8");
            helper.setFrom(from);
            helper.setTo(destino);
            helper.setSubject("Confirma tu cuenta en Nexly");
            helper.setText(plantillaHtml(nombre, enlace), true);
            mailSender.send(mensaje);
        } catch (MessagingException e) {
            throw new IllegalStateException("No se pudo enviar el correo de verificación", e);
        }
    }

    private String plantillaHtml(String nombre, String enlace) {
        return """
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1f2937">
              <h1 style="color:#7c3aed;margin:0 0 16px">Nexly</h1>
              <h2 style="font-size:18px;margin:0 0 12px">¡Hola, %s!</h2>
              <p style="line-height:1.5">Gracias por unirte a Nexly. Para activar tu cuenta y empezar a
              conectar con tus comunidades, confirma tu dirección de correo pulsando el botón:</p>
              <p style="text-align:center;margin:28px 0">
                <a href="%s" style="background:#7c3aed;color:#fff;text-decoration:none;
                   padding:12px 28px;border-radius:9999px;font-weight:bold;display:inline-block">
                  Verificar mi cuenta
                </a>
              </p>
              <p style="font-size:13px;color:#6b7280;line-height:1.5">Si el botón no funciona, copia y pega
              este enlace en tu navegador:<br><a href="%s" style="color:#7c3aed">%s</a></p>
              <p style="font-size:13px;color:#6b7280">Este enlace caduca en 24 horas. Si no creaste esta
              cuenta, puedes ignorar este mensaje.</p>
            </div>
            """.formatted(nombre, enlace, enlace, enlace);
    }
}
