
import { GoogleGenAI } from "@google/genai";
import { Booking } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateBookingEmailContent(booking: Booking): Promise<string> {
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(booking.time);

    const prompt = `
      Eres un asistente de reservas. Escribe un correo electrónico de notificación interna conciso y profesional en español para ser enviado a 'manuelsanchez@jerez.es'.
      El correo debe informar sobre una nueva reserva realizada a través del sistema online.
      NO incluyas una línea de asunto (Subject:).
      Comienza directamente con el cuerpo del correo.
      Utiliza un tono formal y claro.
      
      Aquí están los detalles de la reserva:
      - Cliente: ${booking.customerName}
      - Email del Cliente: ${booking.customerEmail}
      - Profesional: ${booking.staff.name}
      - Servicio: ${booking.service.name}
      - Fecha y Hora: ${formattedDate}
      - Duración: ${booking.service.duration} minutos
      - Precio: ${booking.service.price} EUR

      Finaliza el correo con una simple despedida como "Saludos cordiales,". No añadas nada más después de la despedida.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate email content.");
    }
}