module.exports.generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const nowInFormatYmdHis = new Date().toISOString().replace(/[-:T]/g, "").split(".")[0];
    const lengthOfNowInFormatYmdHis = nowInFormatYmdHis.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length)); 
    }
    return result + nowInFormatYmdHis;
};
module.exports.generateRandomNumber = (length) => {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length)); 
    }
    return result;
};

