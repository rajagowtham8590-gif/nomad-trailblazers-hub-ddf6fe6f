<?php
/**
 * Nomad Bikers Club - PHP Form Submission & Email Handler
 * Handles form submissions for Contact, Booking, and Careers.
 * Sends email notifications to rajagowtham8590@gmail.com.
 */

// Allow CORS if called from local dev server or external origin
if (!headers_sent()) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'POST';
if ($requestMethod === 'OPTIONS') {
    if (!headers_sent()) http_response_code(200);
    exit;
}

if (!headers_sent()) {
    header('Content-Type: application/json; charset=UTF-8');
}

// Configuration
$TO_EMAIL = getenv('SUPPORT_EMAIL') ?: 'rajagowtham8590@gmail.com';
$FROM_EMAIL = 'support@nomadbikersclub.in';
$FROM_NAME = 'Nomad Bikers Club';

// Read input data (handles JSON or standard POST in web or CLI)
$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    $rawInput = @file_get_contents('php://stdin');
}
$data = [];

if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $data = $decoded;
    }
}

if (empty($data) && !empty($_POST)) {
    $data = $_POST;
}

// Support both flat format and { formType, payload, website } format
$formType = $data['formType'] ?? $data['form_type'] ?? '';
$payload = $data['payload'] ?? $data;
$website = $data['website'] ?? $payload['website'] ?? '';

// 1. Spam protection: Honeypot check
if (!empty(trim($website))) {
    echo json_encode([
        'ok' => true,
        'spam' => true,
        'message' => 'Thank you for your submission.'
    ]);
    exit;
}

// 2. Normalize and extract fields
$name = trim((string)($payload['name'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$city = trim((string)($payload['city'] ?? ''));
$service = trim((string)($payload['service'] ?? ''));
$comfort = trim((string)($payload['comfort'] ?? ''));
$instagram = trim((string)($payload['instagram'] ?? ''));
$experience = $payload['experience'] ?? null;
$message = trim((string)($payload['message'] ?? ''));

// Form titles & service labels
$formTitles = [
    'booking' => 'New Booking Reservation - Nomad Bikers Club Website',
    'careers' => 'New Trainer Career Application - Nomad Bikers Club Website',
    'career_application' => 'New Trainer Career Application - Nomad Bikers Club Website',
    'contact' => 'New Contact Enquiry - Nomad Bikers Club Website',
];

$serviceLabels = [
    'beginner' => 'Beginner Training Batch',
    'pt' => 'Scooty / Bike Personal Training',
    'regular' => 'Regular Training Batch',
    'getaway' => 'Getaways',
];

// Determine form type if not explicitly passed
if (empty($formType)) {
    if (!empty($service) || !empty($comfort)) {
        $formType = 'booking';
    } elseif (!empty($instagram) || $experience !== null) {
        $formType = 'careers';
    } else {
        $formType = 'contact';
    }
}

$subject = $formTitles[$formType] ?? ('New Form Submission (' . htmlspecialchars($formType) . ') - Nomad Bikers Club Website');

// 3. Validation
$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = ['field' => 'name', 'message' => 'Please enter your name (at least 2 characters).'];
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = ['field' => 'email', 'message' => 'Please enter a valid email address.'];
}

if ($formType === 'booking') {
    if (empty($phone) || !preg_match('/^[+\d\s().-]{8,20}$/', $phone)) {
        $errors[] = ['field' => 'phone', 'message' => 'Please enter a valid phone number.'];
    }
    if (empty($city)) {
        $errors[] = ['field' => 'city', 'message' => 'Please enter your city.'];
    }
    if (empty($service)) {
        $errors[] = ['field' => 'service', 'message' => 'Please choose a program.'];
    }
    if (empty($comfort)) {
        $errors[] = ['field' => 'comfort', 'message' => 'Please select yes or no.'];
    }
} elseif ($formType === 'careers' || $formType === 'career_application') {
    if (empty($phone) || !preg_match('/^[+\d\s().-]{8,20}$/', $phone)) {
        $errors[] = ['field' => 'phone', 'message' => 'Please enter a valid phone number.'];
    }
    if (empty($city)) {
        $errors[] = ['field' => 'city', 'message' => 'Please enter your city.'];
    }
    if (empty($instagram)) {
        $errors[] = ['field' => 'instagram', 'message' => 'Please provide your Instagram handle.'];
    }
    if ($experience === null || $experience === '' || !is_numeric($experience)) {
        $errors[] = ['field' => 'experience', 'message' => 'Please enter your years of riding experience.'];
    }
} elseif ($formType === 'contact') {
    if (empty($message) || mb_strlen($message) < 10) {
        $errors[] = ['field' => 'message', 'message' => 'Please enter a message of at least 10 characters.'];
    }
}

if (!empty($errors)) {
    if (!headers_sent()) http_response_code(400);
    echo json_encode([
        'ok' => false,
        'errors' => $errors,
        'message' => 'Please check the required fields.'
    ]);
    exit;
}

// 4. Build field items for email
$fields = [];
$fields['Full Name'] = $name;
$fields['Email Address'] = $email;

if (!empty($phone)) $fields['Phone / Mobile'] = $phone;
if (!empty($city)) $fields['City'] = $city;

if ($formType === 'booking') {
    $fields['Selected Program'] = $serviceLabels[$service] ?? $service;
    $fields['Comfortable with two-wheelers/cycle'] = ucfirst(strtolower($comfort));
} elseif ($formType === 'careers' || $formType === 'career_application') {
    $fields['Instagram Handle'] = $instagram;
    $fields['Geared Bike Experience'] = $experience . ' year(s)';
} elseif ($formType === 'contact') {
    $fields['Message'] = nl2br(htmlspecialchars($message));
}

// Date in Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');
$timestamp = date('d M Y, h:i A') . ' IST';

// 5. Build HTML Email
$rowsHtml = '';
foreach ($fields as $label => $val) {
    $displayVal = ($label === 'Message') ? $val : htmlspecialchars((string)$val);
    $rowsHtml .= '<tr>';
    $rowsHtml .= '<td style="padding: 10px 14px; font-weight: 600; color: #374151; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; width: 35%;">' . htmlspecialchars($label) . '</td>';
    $rowsHtml .= '<td style="padding: 10px 14px; color: #111827; border-bottom: 1px solid #e5e7eb;">' . $displayVal . '</td>';
    $rowsHtml .= '</tr>';
}

$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{$subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <thead>
      <tr>
        <th style="padding: 24px; background: #0f172a; text-align: left;">
          <span style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #f59e0b; font-weight: 700;">Nomad Bikers Club</span>
          <h1 style="margin: 6px 0 0; font-size: 20px; color: #ffffff; font-weight: 700;">{$subject}</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 24px;">
          <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">
            A new submission was received on your website on <strong>{$timestamp}</strong>.
          </p>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; border-collapse: separate; overflow: hidden; font-size: 14px;">
            <tbody>
              {$rowsHtml}
            </tbody>
          </table>
          <div style="margin-top: 20px; padding: 14px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; font-size: 13px; color: #92400e;">
            <strong>Quick Reply:</strong> Click "Reply" in your email client to email <strong>{$email}</strong> directly.
          </div>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
          Nomad Bikers Club Website Notification &bull; Destination: {$TO_EMAIL}
        </td>
      </tr>
    </tfoot>
  </table>
</body>
</html>
HTML;

// 6. Email Headers (HTML + Reply-To)
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . $FROM_NAME . ' <' . $FROM_EMAIL . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

// Send email using PHP mail()
$mailSent = @mail($TO_EMAIL, $subject, $htmlBody, implode("\r\n", $headers));

// 7. Save backup log in submission history file
$logEntry = [
    'timestamp' => $timestamp,
    'form_type' => $formType,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'fields' => $fields,
    'mail_sent' => $mailSent,
];
@file_put_contents(
    __DIR__ . '/form_submissions.log',
    json_encode($logEntry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

// 8. Return JSON Response to frontend
echo json_encode([
    'ok' => true,
    'mail_sent' => $mailSent,
    'message' => 'Thank you! Your submission has been received.'
]);
