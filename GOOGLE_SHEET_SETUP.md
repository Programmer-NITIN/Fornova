# Fornova Interior — Google Sheets Lead Capture Setup

*A 2-minute step-by-step guide to connect the website's Consultation Booking Form directly to your private Google Sheet.*

---

## Why this is the best setup for your studio:
* **100% Free forever** (uses your standard Google/Gmail account, no paid subscriptions).
* **Zero maintenance** (never breaks, zero WordPress plugin bloat, no monthly renewals).
* **Mobile-friendly**: Open the Google Sheets app on your phone to review leads anywhere.
* **Instant Email Notifications**: Automatically sends an email notification to your Gmail with 1-click WhatsApp and call buttons every time a new client submits an inquiry.

---

## Step 1: Create a New Google Sheet (30 seconds)

1. Open **[Google Sheets (sheets.new)](https://sheets.new)** in your web browser.
2. Title the sheet in the top left: **`Fornova Interior — Client Leads`**.
3. *(Optional)* You can leave the sheet completely blank — the automated script below will automatically create styled column headers for you upon the first lead submission!

If you prefer to add the column headers manually, paste these in **Row 1**:
| A | B | C | D | E | F | G | H |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Timestamp (IST)** | **Client Name** | **Phone Number** | **Vadodara Locality** | **Service Scope** | **Project Details / Notes** | **Source** | **Status** |

---

## Step 2: Paste the Automated Apps Script (1 minute)

1. In your Google Sheet, click the top menu: **Extensions** &rarr; **Apps Script**.
2. Erase any placeholder code in `Code.gs` and paste the following complete script:

```javascript
/**
 * FORNOVA INTERIOR — Atelier Lead Webhook & Notification Engine
 * Automatically records website consultations & emails the studio owner.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds to safely handle concurrent client inquiries
  try {
    lock.waitLock(30000);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Atelier server busy. Please retry.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // 1. Auto-create luxury formatted header if the sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp (IST)',
        'Client Name',
        'Phone Number',
        'Vadodara Locality',
        'Service Scope',
        'Project Details / Notes',
        'Source',
        'Status'
      ]);
      sheet.getRange(1, 1, 1, 8)
        .setFontWeight('bold')
        .setBackground('#FCF9F3')
        .setFontColor('#1A1918')
        .setFontFamily('DM Sans');
      sheet.setFrozenRows(1);
    }

    // 2. Parse incoming POST payload (supports URL-encoded and JSON)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 3. Clean and format variables
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy hh:mm a");
    var name = data.client_name || data.name || 'Anonymous Client';
    var rawPhone = (data.client_phone || data.phone || 'Not Provided').toString();
    // Escape leading '+' or '=' so Google Sheets displays as literal text rather than evaluating as a formula
    var phone = (rawPhone.indexOf('+') === 0 || rawPhone.indexOf('=') === 0) ? "'" + rawPhone : rawPhone;
    var locality = data.client_locality || data.locality || 'Vadodara';
    var service = data.client_service || data.service || 'Turnkey Interior';
    var notes = data.client_notes || data.notes || 'None';
    var source = data.source || 'Website Consultation Desk';

    // 4. Append the new lead as a row
    sheet.appendRow([
      timestamp,
      name,
      phone,
      locality,
      service,
      notes,
      source,
      'New Lead'
    ]);

    // 5. Automatic Email Notification directly to the Studio Owner
    try {
      var ownerEmail = Session.getActiveUser().getEmail();
      if (ownerEmail) {
        var cleanPhone = phone.toString().replace(/[^0-9]/g, '');
        MailApp.sendEmail({
          to: ownerEmail,
          subject: "✨ New Interior Lead: " + name + " (" + locality + ")",
          htmlBody:
            '<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #B88E4F; background: #FCF9F3;">' +
              '<h2 style="color: #1A1918; margin-top: 0; font-family: serif;">FORNOVA INTERIOR — New Client Lead</h2>' +
              '<p style="color: #555; font-size: 14px;">A client has requested a consultation through the website desk.</p>' +
              '<table style="width: 100%; border-collapse: collapse; margin: 18px 0; background: #ffffff; border: 1px solid #e0d8c8;">' +
                '<tr><td style="padding: 10px; font-weight: bold; width: 140px; border-bottom: 1px solid #f0eae0;">Client Name:</td><td style="padding: 10px; border-bottom: 1px solid #f0eae0;">' + name + '</td></tr>' +
                '<tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f0eae0;">Phone / WA:</td><td style="padding: 10px; border-bottom: 1px solid #f0eae0;"><a href="tel:' + phone + '" style="color: #B88E4F; font-weight: bold; text-decoration: none;">' + phone + '</a> &nbsp;|&nbsp; <a href="https://wa.me/' + cleanPhone + '" style="color: #25D366; font-weight: bold; text-decoration: none;">Chat on WhatsApp &rarr;</a></td></tr>' +
                '<tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f0eae0;">Vadodara Locality:</td><td style="padding: 10px; border-bottom: 1px solid #f0eae0;">' + locality + '</td></tr>' +
                '<tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f0eae0;">Service Scope:</td><td style="padding: 10px; border-bottom: 1px solid #f0eae0;">' + service + '</td></tr>' +
                '<tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f0eae0;">Project Details:</td><td style="padding: 10px; border-bottom: 1px solid #f0eae0;">' + notes + '</td></tr>' +
                '<tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f0eae0;">Source:</td><td style="padding: 10px; border-bottom: 1px solid #f0eae0;">' + source + '</td></tr>' +
                '<tr><td style="padding: 10px; font-weight: bold;">Logged At:</td><td style="padding: 10px;">' + timestamp + ' (IST)</td></tr>' +
              '</table>' +
              '<p style="font-size: 12px; color: #888; margin-bottom: 0;">Automated lead record appended to your private Google Sheet.</p>' +
            '</div>'
        });
      }
    } catch (mailErr) {
      // Email quota or permission bypass
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Lead appended successfully',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Health check endpoint (for testing in browser)
function doGet(e) {
  return ContentService
    .createTextOutput("Fornova Interior Atelier Webhook is ACTIVE and ready to accept POST requests.")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. Press **Ctrl + S** (or click the disk icon) to save.

---

## Step 3: Deploy as Web App (30 seconds)

1. In Apps Script, click the blue **Deploy** button (top right) &rarr; select **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" &rarr; select **Web app**.
3. Configure the 3 fields:
   * **Description**: `Fornova Website Lead Webhook`
   * **Execute as**: `Me (your-email@gmail.com)`
   * **Who has access**: **`Anyone`** *(CRUCIAL: Choose 'Anyone' so website visitors can submit inquiries without being forced to log in)*.
4. Click **Deploy**.
5. Google will ask you to authorize permissions:
   * Click **Review permissions** &rarr; select your Google account.
   * Click **Advanced** (small link at bottom left) &rarr; click **Go to Untitled project (unsafe)** &rarr; click **Allow**.
6. Copy the generated **Web App URL** (format: `https://script.google.com/macros/s/AKfycb.../exec`).

> **Quick Verification Test**: Paste your Web App URL directly into a new browser tab. It will display:
> `"Fornova Interior Atelier Webhook is ACTIVE and ready to accept POST requests."`

---

## Step 4: Paste the Web App URL into Website Code

Open `js/app.js` and set the `GOOGLE_SHEET_ENDPOINT` variable at line 8:

```javascript
const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

---

## What Happens When a Client Submits the Form:

1. **Instant Google Sheet Row**: The client's name, phone, Vadodara area (e.g. Vasna-Bhayli, Sevasi, Gotri), service scope, and notes appear in the Google Sheet.
2. **Instant Email to Owner**: The studio owner gets an immediate email with a 1-click **Call** link and a 1-click **Chat on WhatsApp** link.
3. **Client Confirmation Card**: The website displays a luxury confirmation card and a green **Connect on WhatsApp Now** button pre-populated with their inquiry summary.
4. **Zero Lost Leads (Offline Resilient)**: Leads are also safely preserved in browser local storage (`fornova_consultation_leads`) so no lead is ever dropped.
