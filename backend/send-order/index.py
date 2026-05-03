import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта металлопроката на email менеджера."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Invalid JSON"})}

    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    message = body.get("message", "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Имя и телефон обязательны"}),
        }

    smtp_from = os.environ.get("SMTP_FROM_EMAIL", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    smtp_to = os.environ.get("SMTP_TO_EMAIL", "")

    # Определяем SMTP сервер по домену отправителя
    domain = smtp_from.split("@")[-1].lower() if "@" in smtp_from else ""
    if "yandex" in domain or "ya.ru" in domain:
        smtp_host = "smtp.yandex.ru"
        smtp_port = 465
        use_ssl = True
    else:
        smtp_host = "smtp.gmail.com"
        smtp_port = 587
        use_ssl = False

    subject = f"Новая заявка с сайта: {name}"

    html_body = f"""
    <html><body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="background: #1a1917; padding: 24px; text-align: center;">
        <span style="color: #f97316; font-size: 22px; font-weight: bold; letter-spacing: 2px;">СТАЛЬПРОМ</span>
        <p style="color: #888; margin: 4px 0 0; font-size: 13px;">Новая заявка с сайта</p>
      </div>
      <div style="padding: 28px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; width: 130px;">Имя:</td>
            <td style="padding: 10px 0; color: #1a1917; font-size: 15px; font-weight: bold;">{name}</td>
          </tr>
          <tr style="border-top: 1px solid #f0f0f0;">
            <td style="padding: 10px 0; color: #888; font-size: 13px;">Телефон:</td>
            <td style="padding: 10px 0; color: #f97316; font-size: 16px; font-weight: bold;">
              <a href="tel:{phone}" style="color: #f97316; text-decoration: none;">{phone}</a>
            </td>
          </tr>
          {"" if not message else f'<tr style="border-top: 1px solid #f0f0f0;"><td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Сообщение:</td><td style="padding: 10px 0; color: #333; font-size: 14px; line-height: 1.6;">{message}</td></tr>'}
        </table>
      </div>
      <div style="background: #f9f9f9; padding: 16px 28px; border-top: 1px solid #eee;">
        <p style="margin: 0; color: #aaa; font-size: 12px;">Заявка отправлена с сайта stalprom.ru</p>
      </div>
    </div>
    </body></html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_from
    msg["To"] = smtp_to
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    if use_ssl:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
    else:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()

    server.login(smtp_from, smtp_password)
    server.sendmail(smtp_from, smtp_to, msg.as_string())
    server.quit()

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"success": True, "message": "Заявка отправлена"}),
    }
