export interface Email {
  name: string
  receiver: string
  clientName: string
  senderEmail: string
  message: string
  flag: string
}

interface EmailResponse {
  status: string
}

export function useEmailService() {
  const emailUrl = import.meta.env.VITE_EMAIL_URL
  const emailReceiver = import.meta.env.VITE_EMAIL_RECEIVER

  const sendMessage = async ({
    name,
    senderEmail,
    message,
  }: Partial<Email>): Promise<EmailResponse> => {
    const fullMessage: Email = {
      receiver: emailReceiver,
      clientName: 'portfolio',
      name: name as string,
      senderEmail: senderEmail as string,
      message: message as string,
      flag: 'This email was sent from the portolio contact form',
    }

    const res = await fetch(emailUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullMessage),
    })

    const json = await res.json()
    if (!res.ok) throw json

    return json
  }

  return {
    sendMessage,
  }
}
