
export function random(len){
    let ans="";
    let options = "1234567890qwertyuiopasdfghjklzxcvbnm";
    let length = options.length;


    for(let i=0;i<len;i++){
        ans += options[Math.floor(Math.random() * length)];
    }
    return ans;
    
}