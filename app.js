const axios = require('axios');
const request = require('request'); 
const express = require('express');
const app = express();

app.get("/", function(req, res){
    res.send("beep boop");
    let recyclingDay;
    let trashDay; 
    let tomorrow;
    function trashRequest(){
    return new Promise(resolve => {
        request('https://www.pgh.st/locate/1036/Murray%20Hill%20Ave/', function (error, response, body) {
        let info = JSON.parse(body);
        recyclingDay = info[0].next_recycling_date;
        trashDay = info[0].next_pickup_date;
        resolve();
        });
    })
    
    }

    function tomorrowsDate (){
        return new Promise(resolve => {
        let today = new Date();
        let dd = today.getDate() + 1;
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        tomorrow = mm + '-' + dd + '-' + yyyy;
        resolve();
    })
    }

    function groupMePost(){
        if (tomorrow == trashDay && tomorrow == recyclingDay){
            axios.post("https://api.groupme.com/v3/bots/post", {
            "bot_id"  : "841d972456842608d4b31af7cb",
            "text"    : "Tomorrow is trash and recycling day"
            });
        }else if (tomorrow == "11-5-2018"){
            axios.post("https://api.groupme.com/v3/bots/post", {
            "bot_id"  : "841d972456842608d4b31af7cb",
            "text"    : "Tomorrow is trash day"
            });
        }
    
    }
    function alert(){
            if (tomorrow == "11-5-2018"){
            groupMePost();
            }
    }

    async function finalPost(){
        await trashRequest();
        await tomorrowsDate();
        alert();
    }
    finalPost();

   
});
let port = process.env.PORT || 5000

app.listen(port, function(){
    console.log('server running');
});







