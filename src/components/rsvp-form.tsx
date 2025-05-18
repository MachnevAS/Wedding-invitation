
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { submitRsvp } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const alcoholOptions = [
  { id: "champagne", label: "Шампанское" },
  { id: "wine", label: "Вино" },
  { id: "cognac", label: "Коньяк" },
  { id: "whiskey", label: "Виски" },
  { id: "vodka", label: "Водка" },
] as const;

// Client-side schema without recaptchaToken
const rsvpFormClientSchema = z.object({
  guests: z.array(z.object({
    name: z.string().min(2, {
      message: "Пожалуйста, укажите ФИО.",
    }).max(100, {
      message: "Слишком длинное значение."
    }),
    phoneNumber: z.string().min(1, {
      message: "Пожалуйста, укажите номер телефона.",
    }),
    attendance: z.enum(["yes", "no"], {
      required_error: "Пожалуйста, выберите один из вариантов.",
    }),
    alcoholPreference: z.array(z.string()).optional(),
    housingRequired: z.enum(["yes", "no"]).optional(),
  })).superRefine((guests, ctx) => {
    guests.forEach((guest, index) => {
      if (guest.attendance === 'yes' && !guest.housingRequired) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Пожалуйста, выберите вариант по жилью.",
          path: [index, 'housingRequired'],
        });
      }
    });
  }),
  message: z.string().max(500, "Сообщение слишком длинное.").optional(),
  secretNotes: z.string().optional(), // Honeypot field
});


export function RsvpForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const form = useForm<z.infer<typeof rsvpFormClientSchema>>({
    resolver: zodResolver(rsvpFormClientSchema),
    defaultValues: {
      guests: [
        {
          name: "",
          phoneNumber: "",
          attendance: undefined,
          alcoholPreference: [],
          housingRequired: undefined,
        }
      ],
      message: "",
      secretNotes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  const handleRecaptcha = useCallback(async () => {
    if (!siteKey) {
      console.error("reCAPTCHA site key is not defined.");
      toast({
        title: "Ошибка конфигурации",
        description: "reCAPTCHA не настроена правильно. Пожалуйста, свяжитесь с нами.",
        variant: "destructive",
      });
      return null;
    }
    return new Promise<string | null>((resolve) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(siteKey, { action: 'submit_rsvp' }).then((token: string) => {
          resolve(token);
        }).catch((error: any) => {
          console.error("Ошибка выполнения reCAPTCHA:", error);
          toast({
            title: "Ошибка reCAPTCHA",
            description: "Не удалось получить токен reCAPTCHA. Пожалуйста, попробуйте еще раз.",
            variant: "destructive",
          });
          resolve(null);
        });
      });
    });
  }, [siteKey, toast]);


  async function onSubmit(values: z.infer<typeof rsvpFormClientSchema>) {
    setIsSubmitting(true);

    const recaptchaToken = await handleRecaptcha();

    if (!recaptchaToken) {
      setIsSubmitting(false);
      return; // Stop submission if reCAPTCHA failed
    }
    
    const valuesWithToken = { ...values, recaptchaToken };
    
    try {
      const result = await submitRsvp(valuesWithToken);
      if (result.success) {
        toast({
          title: "Ответ отправлен!",
          description: "Спасибо, мы получили ваш ответ.",
        });
        form.reset({ // Reset with default structure, recaptchaToken is not part of form state
           guests: [
            {
              name: "",
              phoneNumber: "",
              attendance: undefined,
              alcoholPreference: [],
              housingRequired: undefined,
            }
          ],
          message: "",
          secretNotes: "",
        });
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось отправить ответ. Попробуйте еще раз.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      toast({
        title: "Ошибка",
        description: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="secretNotes"
          render={({ field }) => (
            <FormItem className="absolute -left-[5000px]" aria-hidden="true">
              <FormLabel htmlFor="secretNotes">Secret Notes</FormLabel>
              <FormControl>
                <Input {...field} tabIndex={-1} autoComplete="off" />
              </FormControl>
            </FormItem>
          )}
        />

        {fields.map((item, index) => (
          <div key={item.id} className="border p-4 rounded-md space-y-4">
            <h3 className="text-lg font-semibold">Гость {index + 1}</h3>
            <FormField
              control={form.control}
              name={`guests.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО гостя (обязательно)</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Иванов Иван Иванович" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`guests.${index}.phoneNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефона гостя (обязательно)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+7 (XXX) XXX-XX-XX"
                      {...field}
                      onChange={(event) => {
                        const input = event.target.value.replace(/\D/g, '');
                        const cleanInput = input.replace(/^[78]/, '');
                        const trimmedInput = cleanInput.slice(0, 10);

                        let formattedValue = '+7';
                        if (trimmedInput.length === 0) {
                          formattedValue = '';
                        } else if (trimmedInput.length <= 3) {
                          formattedValue += ` (${trimmedInput}`;
                        } else if (trimmedInput.length <= 6) {
                          formattedValue += ` (${trimmedInput.slice(0, 3)}) ${trimmedInput.slice(3)}`;
                        } else if (trimmedInput.length <= 8) {
                          formattedValue += ` (${trimmedInput.slice(0, 3)}) ${trimmedInput.slice(3, 6)}-${trimmedInput.slice(6)}`;
                        } else {
                          formattedValue += ` (${trimmedInput.slice(0, 3)}) ${trimmedInput.slice(3, 6)}-${trimmedInput.slice(6, 8)}-${trimmedInput.slice(8)}`;
                        }
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`guests.${index}.attendance`}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Планируете ли Вы присутствовать?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Да, с удовольствием приду!
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          К сожалению, не смогу.
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch(`guests.${index}.attendance`) === 'yes' && (
              <>
                <FormField
                  control={form.control}
                  name={`guests.${index}.alcoholPreference`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Предпочтения в алкоголе</FormLabel>
                        <FormDescription>
                          Выберите напитки, которые вы предпочитаете.
                        </FormDescription>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {alcoholOptions.map((alcoholItem) => (
                          <FormField
                            key={alcoholItem.id}
                            control={form.control}
                            name={`guests.${index}.alcoholPreference`}
                            render={({ field: checkboxField }) => {
                              return (
                                <FormItem key={alcoholItem.id} className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={checkboxField.value?.includes(alcoholItem.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? checkboxField.onChange([...(checkboxField.value || []), alcoholItem.id])
                                          : checkboxField.onChange(
                                              checkboxField.value?.filter(
                                                (value) => value !== alcoholItem.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {alcoholItem.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`guests.${index}.housingRequired`}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Требуется ли бронирование жилья?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Да, требуется жилье
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Нет, сами решим вопрос
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {fields.length > 1 && (
              <Button type="button" variant="outline" onClick={() => remove(index)}>
                Удалить гостя
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ 
            name: "", 
            phoneNumber: "", 
            attendance: undefined, 
            alcoholPreference: [], 
            housingRequired: undefined 
          })}
          className="w-full"
        >
          Добавить еще гостя
        </Button>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сообщение для нас (по желанию)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ваши теплые слова или вопросы..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Отправить ответ
        </Button>
      </form>
    </Form>
  );
}
