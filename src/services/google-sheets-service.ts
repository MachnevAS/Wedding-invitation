
'use server';

import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis';

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

function getGoogleSheetsClient(): sheets_v4.Sheets | null {
  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const serviceAccountKeyEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!GOOGLE_SHEET_ID) {
    console.error('Переменная окружения GOOGLE_SHEET_ID не установлена в файле .env');
    return null;
  }

  if (!serviceAccountKeyEnv) {
    console.error('Переменная окружения GOOGLE_SERVICE_ACCOUNT_KEY не установлена в файле .env. Убедитесь, что она присутствует и правильно отформатирована (JSON-строка в одинарных кавычках).');
    return null;
  }

  let parsedKey: ServiceAccountCredentials;
  try {
    const keyString = String(serviceAccountKeyEnv);
    parsedKey = JSON.parse(keyString);
  } catch (e) {
    console.error('Ошибка парсинга GOOGLE_SERVICE_ACCOUNT_KEY. Убедитесь, что это корректная JSON-строка, заключенная в одинарные кавычки в вашем файле .env. Если ключ содержит спецсимволы или переносы строк, он должен быть правильно экранирован или заключен в одинарные кавычки.', e);
    return null;
  }

  if (!parsedKey.client_email || !parsedKey.private_key) {
    console.error('client_email или private_key отсутствуют в GOOGLE_SERVICE_ACCOUNT_KEY.');
    return null;
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: parsedKey.client_email,
      private_key: parsedKey.private_key.replace(/\\n/g, '\n'), 
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getPhotoAlbumLink(): Promise<string> {
  const sheets = getGoogleSheetsClient();
  if (!sheets) return "";

  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!; 
  const photoSheetName = process.env.GOOGLE_PHOTO_SHEET_NAME || 'photo';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${photoSheetName}!A2`, 
    });
    return response.data.values?.[0]?.[0] || "";
  } catch (error) {
    console.error('Ошибка при получении ссылки на фотоальбом из Google Sheets:', error);
    return "";
  }
}

interface GuestRsvpData {
  name: string;
  phoneNumber: string;
  attendance: 'yes' | 'no';
  alcoholPreference?: string[];
  housingRequired?: 'yes' | 'no';
}

export async function saveGuestsRsvp(guests: GuestRsvpData[], commonMessage?: string): Promise<void> {
  const sheets = getGoogleSheetsClient();
  if (!sheets) {
    throw new Error('Не удалось инициализировать клиент Google Sheets. Проверьте логи сервера.');
  }

  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
  const guestsSheetName = process.env.GOOGLE_GUESTS_SHEET_NAME || 'guests';
  
  const headers = ['ФИО', 'Номер телефона', 'Присутствие', 'Алкоголь', 'Жилье', 'Сообщение для нас', 'Время отправки сообщения'];
  
  const now = new Date();
  const targetTimeZone = 'Europe/Moscow';

  const day = now.toLocaleString('ru-RU', { day: '2-digit', timeZone: targetTimeZone });
  const month = now.toLocaleString('ru-RU', { month: '2-digit', timeZone: targetTimeZone });
  const year = now.toLocaleString('ru-RU', { year: 'numeric', timeZone: targetTimeZone });
  let hour = now.toLocaleString('ru-RU', { hour: '2-digit', hour12: false, timeZone: targetTimeZone });
  const minute = now.toLocaleString('ru-RU', { minute: '2-digit', timeZone: targetTimeZone });
  const second = now.toLocaleString('ru-RU', { second: '2-digit', timeZone: targetTimeZone });

  if (hour === '24') { // toLocaleString for hour can return '24' for midnight
    hour = '00';
  }
  
  const submissionTime = `${day}.${month}.${year} ${hour}:${minute}:${second}`;

  try {
    const headerCheckResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${guestsSheetName}!A1:G1`,
    });

    if (!headerCheckResponse.data.values || headerCheckResponse.data.values.length === 0 || 
        JSON.stringify(headerCheckResponse.data.values[0]) !== JSON.stringify(headers)) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: `${guestsSheetName}!A1:G1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });
    }
  } catch (error) {
    console.warn('Не удалось проверить или записать заголовки (лист может быть новым/пустым, или ошибка доступа). Попытка продолжить без обновления заголовков:', error);
  }
  
  const rowsToAppend = guests.map(guest => {
    let formattedPhoneNumber = '-';
    if (guest.phoneNumber) {
      let digits = guest.phoneNumber.replace(/\D/g, ''); 
      if (digits.startsWith('7') && digits.length === 11) {
        formattedPhoneNumber = '8' + digits.substring(1);
      } else if (digits.length === 10 && !digits.startsWith('8') && !digits.startsWith('7')) { 
        formattedPhoneNumber = '8' + digits;
      } else if (digits.startsWith('8') && digits.length === 11) {
        formattedPhoneNumber = digits;
      } else if (digits.length > 0) {
        formattedPhoneNumber = digits; 
      }
    }

    return [
      guest.name || '-',
      formattedPhoneNumber,
      guest.attendance === 'yes' ? 'да' : 'нет',
      (guest.alcoholPreference && guest.alcoholPreference.length > 0 ? guest.alcoholPreference.join(', ') : '-'),
      guest.attendance === 'yes' ? (guest.housingRequired === 'yes' ? 'да' : (guest.housingRequired === 'no' ? 'нет' : 'не указано')) : '-',
      commonMessage || '-',
      submissionTime
    ];
  });

  if (rowsToAppend.length === 0) {
    console.log("Нет данных о гостях для добавления.");
    return;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${guestsSheetName}!A1`, 
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS', 
      requestBody: {
        values: rowsToAppend,
      },
    });
  } catch (error) {
    console.error('Ошибка сохранения данных RSVP в Google Sheets:', error);
    throw new Error('Не удалось сохранить данные RSVP в Google Sheets.');
  }
}
