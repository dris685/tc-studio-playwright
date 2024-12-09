import CryptoJS from "crypto-js";

const secretKey = process.env.SECRET_KEY

    export function encryptData(data){
    return CryptoJS.AES.encrypt(data, secretKey).toString()
}

    export function decryptData(encryptedData){
    return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8)
}