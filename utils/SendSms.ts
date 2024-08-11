import * as SMS from 'expo-sms';

const SendSMS = async (phoneNumber: string, msg: string) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
        alert("SMS is not available on this device");
        return
    }

    const { result } = await SMS.sendSMSAsync(
        phoneNumber,
        msg,
    )

    switch (result) {
        case 'sent':
            alert(`SMS sent successfully, invited ${phoneNumber}`);
            return;
        case 'cancelled':
            alert(`SMS cancelled, didn't invite ${phoneNumber}`);
            return;
        case 'unknown':
            alert(`SMS unknown error, didn't invite ${phoneNumber}`);
            return;
    }
}

export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export default SendSMS;