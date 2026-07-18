const SPREADSHEET_ID = '1uoj-rSOSAR1SKGMSLQISE0SjGQfMLyIg8IxMKDTvFOU';
const LANDING_SHEET = 'Página1';
const INSTITUTIONAL_SHEET = 'Leads - Site Institucional';

const LANDING_HEADERS = [
  'Data',
  'Nome',
  'Email ',
  'Telefone',
  'Faturamento ',
  'Mensagem',
  'UTM Source ',
  'UTM Medium',
  'UTM Campaign',
  'UTM Term',
  'UTM Content',
];

const INSTITUTIONAL_HEADERS = [
  'Data',
  'Nome',
  'Empresa',
  'Telefone',
  'E-mail',
  'Mensagem',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Term',
  'UTM Content',
  'Origem',
];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const payload = JSON.parse(e && e.postData && e.postData.contents || '{}');
    const isInstitutional = payload.origem === 'site-institucional';

    validatePayload(payload, isInstitutional);
    lock.waitLock(10000);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = isInstitutional ? INSTITUTIONAL_SHEET : LANDING_SHEET;
    const headers = isInstitutional ? INSTITUTIONAL_HEADERS : LANDING_HEADERS;
    const sheet = getOrCreateSheet(spreadsheet, sheetName, headers);
    const row = isInstitutional
      ? buildInstitutionalRow(payload)
      : buildLandingRow(payload);

    sheet.appendRow(row);

    return jsonResponse({ status: 'success' });
  } catch (error) {
    console.error(error);
    return jsonResponse({
      status: 'error',
      message: 'Não foi possível registrar o lead.',
    });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function validatePayload(payload, isInstitutional) {
  const required = isInstitutional
    ? ['nome', 'empresa', 'telefone', 'email', 'mensagem']
    : ['nome', 'email', 'telefone'];

  required.forEach(function (field) {
    if (!String(payload[field] || '').trim()) {
      throw new Error('Campo obrigatório ausente: ' + field);
    }
  });
}

function getOrCreateSheet(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange
      .setBackground('#2d381e')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function buildInstitutionalRow(payload) {
  return [
    new Date(),
    safeCell(payload.nome),
    safeCell(payload.empresa),
    safeCell(payload.telefone),
    safeCell(payload.email),
    safeCell(payload.mensagem),
    safeCell(payload.utm_source),
    safeCell(payload.utm_medium),
    safeCell(payload.utm_campaign),
    safeCell(payload.utm_term),
    safeCell(payload.utm_content),
    'Site institucional',
  ];
}

function buildLandingRow(payload) {
  return [
    new Date(),
    safeCell(payload.nome),
    safeCell(payload.email),
    safeCell(payload.telefone),
    safeCell(payload.faturamento),
    safeCell(payload.mensagem),
    safeCell(payload.utm_source),
    safeCell(payload.utm_medium),
    safeCell(payload.utm_campaign),
    safeCell(payload.utm_term),
    safeCell(payload.utm_content),
  ];
}

function safeCell(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
