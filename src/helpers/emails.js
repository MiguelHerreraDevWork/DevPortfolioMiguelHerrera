import emailjs from "@emailjs/browser";

const emails = {
    publicKey: "GDfJMYM-LMXa4FLNS", // Clave pública de EmailJS
    serviceId: "service_clrw92a", // ID del servicio
    templateId: "template_xnjyrsy", // ID de la plantilla

    init: () => {
        emailjs.init(emails.publicKey);
        console.log("EmailJS initialized with publicKey:", emails.publicKey);
    },

    sendContactEmail: async (params) => {
        try {
            const response = await emailjs.send(
                emails.serviceId,
                emails.templateId,
                params
            );
            console.log("Email sent successfully:", response.status, response.text);
            return true;
        } catch (error) {
            console.error("Failed to send email:", error);
            return false;
        }
    }
};

// Inicializa el servicio
emails.init();

// Define `useEmails` para compatibilidad
export const useEmails = () => emails;

export default emails;
