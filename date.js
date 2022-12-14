
exports.getDate=function() {
    const options = {
        day: "numeric",
        weekday: "long",
        month: "long"
    }
    const date = new Date();
    
    let day = date.toLocaleDateString("en-US", options);
    return day;    

}

