
"use server";

import { z } from "zod";
import { saveGuestsRsvp } from '@/services/google-sheets-service';

// Server-side schema including recaptchaToken
const rsvpFormSchema = z.object({
  guests: z.array(z.object({
    name: z.string().min(2, { message: "Пожалуйста, укажите ФИО." }).max(100, { message: "Слишком длинное значение." }),
    phoneNumber: z.string().min(1, { message: "Пожалуйста, укажите номер телефона." }),
    attendance: z.enum(["yes", "no"], { required_error: "Пожалуйста, выберите один из вариантов." }),
    alcoholPreference: z.array(z.string()).optional(),
    housingRequired: z.enum(["yes", "no"]).optional(),
  })).min(1, "Добавьте хотя бы одного гостя.")
    .superRefine((guests, ctx) => {
      guests.forEach((guest, index) => {
        if (guest.attendance === 'yes' && !guest.housingRequired) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Пожалуйста, выберите вариант по жилью.",
            path: ['guests', index, 'housingRequired'],
          });
        }
      });
    }),
  message: z.string().max(500, "Сообщение слишком длинное.").optional(),
  secretNotes: z.string().optional(), // Honeypot field
  recaptchaToken: z.string().min(1, { message: "Токен reCAPTCHA обязателен." }),
});

interface RsvpResponse {
    success: boolean;
    error?: string;
}

const alcoholIdToLabelMap: Record<string, string> = {
  champagne: "Шампанское",
  wine: "Вино",
  cognac: "Коньяк",
  whiskey: "Виски",
  vodka: "Водка",
};

const RECAPTCHA_SCORE_THRESHOLD = 0.5; // Adjust as needed

async function verifyRecaptchaToken(token: string): Promise<{ success: boolean; score?: number; error?: string; errorCodes?: string[] }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not set in environment variables.');
    return { success: false, error: 'Ошибка конфигурации сервера для reCAPTCHA.' };
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;
  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  try {
    const response = await fetch(verificationUrl, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка ответа от сервиса reCAPTCHA: ${response.status}`, errorText);
      return { success: false, error: `Ошибка связи с сервисом reCAPTCHA: ${response.status}` };
    }
    
    const data = await response.json();

    if (data.success) {
      console.log('reCAPTCHA v3 score:', data.score, 'action:', data.action);
      if (data.score < RECAPTCHA_SCORE_THRESHOLD) {
        console.warn(`Низкий балл reCAPTCHA: ${data.score}. Возможен бот.`);
        return { success: false, score: data.score, error: 'Проверка reCAPTCHA не пройдена (низкий балл).' };
      }
      if (data.action !== 'submit_rsvp') { // Ensure action matches
        console.warn(`Неверное действие reCAPTCHA: получено ${data.action}, ожидалось submit_rsvp`);
        return { success: false, error: 'Проверка reCAPTCHA не пройдена (неверное действие).' };
      }
      return { success: true, score: data.score };
    } else {
      console.error('Проверка reCAPTCHA не удалась:', data['error-codes']);
      return { 
        success: false, 
        error: 'Проверка reCAPTCHA не удалась.',
        errorCodes: data['error-codes'] 
      };
    }
  } catch (error) {
    console.error('Критическая ошибка при проверке токена reCAPTCHA:', error);
    return { success: false, error: 'Внутренняя ошибка сервера при проверке reCAPTCHA.' };
  }
}


export async function submitRsvp(
  values: z.infer<typeof rsvpFormSchema>
): Promise<RsvpResponse> {
  try {
    // 1. Validate overall data including recaptchaToken
    const validatedData = rsvpFormSchema.parse(values);

    // 2. Verify reCAPTCHA token
    const recaptchaVerification = await verifyRecaptchaToken(validatedData.recaptchaToken);
    if (!recaptchaVerification.success) {
      return { success: false, error: recaptchaVerification.error || "Ошибка проверки reCAPTCHA." };
    }

    // 3. Honeypot check
    if (validatedData.secretNotes) {
      console.log("Honeypot field filled. Potential bot submission.");
      return { success: true }; 
    }

    // 4. Process and save data if reCAPTCHA and honeypot checks pass
    const processedGuests = validatedData.guests.map(guest => {
      const mappedAlcoholPreference = guest.alcoholPreference
        ?.map(id => alcoholIdToLabelMap[id] || id) 
        .filter(label => label); 

      return {
        ...guest,
        alcoholPreference: mappedAlcoholPreference && mappedAlcoholPreference.length > 0 ? mappedAlcoholPreference : undefined,
      };
    });

    await saveGuestsRsvp(processedGuests, validatedData.message);

    return { success: true };

  } catch (error) {
    console.error("RSVP Submission Error:", error);
    let errorMessage = "Произошла ошибка при отправке вашего ответа.";
    if (error instanceof z.ZodError) {
      console.error("Validation Error (actions.ts):", error.flatten());
      // Check if the error is about recaptchaToken for a more specific client message if needed
      const recaptchaError = error.flatten().fieldErrors.recaptchaToken;
      if (recaptchaError) {
        errorMessage = recaptchaError.join(' ');
      } else {
        errorMessage = "Ошибка валидации данных. Проверьте введенные значения.";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}
