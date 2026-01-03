<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer files
require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = $_POST['name'];
    $email   = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $mail = new PHPMailer(true);

    try {
        // $mail->isSMTP();
        // $mail->Host       = 'speedyinternet.net'; 
        // $mail->SMTPAuth   = true; 
        // $mail->Username   = 'speedyinternet06@gmail.com'; 
        // $mail->Password   = 'AllahGee@0786'; // your email password
        // $mail->SMTPSecure = 'tls'; 
        // $mail->Port       = 587;

    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'speedyinternet.net';          // Outgoing server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@speedyinternet.net';     // Full cPanel email account
    $mail->Password   = 'Pakistan123456!';             // Mailbox password
    $mail->SMTPSecure = 'ssl';                        // SSL encryption
    $mail->Port       = 465;                          // SSL port

    // Optional: bypass SSL certificate verification (common on shared hosting)
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true
        ]
    ];

    // Recipients
    $mail->setFrom('info@speedyinternet.net', 'Speedy Internet'); 
    $mail->addAddress('speedyinternet06@gmail.com'); // Recipient 1

        // Email content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = "
            <strong>Name:</strong> $name <br>
            <strong>Email:</strong> $email <br>
            <strong>Message:</strong><br>$message
        ";

        if ($mail->send()) {
            echo 'OK';
        } else {
            echo 'Something went wrong. Please try again.';
        }
    } catch (Exception $e) {
        echo "Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
