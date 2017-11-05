const config = require('./config');
const twit = require('twit');
const T = new twit(config);
const m = require('./data/meals.js');
const bf = m.breakfast;
const animals = require('animals');
const cronJob = require('cron').CronJob;
const stream = T.stream('user');

// this function will grab a random animal and a random breakfast item and make a meal. it will then tweet out that meal
function breakFast(){
  var test = animals();
  var breakfast = bf[Math.floor(Math.random()*bf.length)];
  var bfjuice = animals();
  var temp = m.drinkTemp[Math.floor(Math.random()*m.drinkTemp.length)];
  params = {
    status: 'today for breakfast @realdonaldtrump is having ' + test + '-dick ' + breakfast + ' with a tall glass of '+ temp + " "+ bfjuice + ' urine'

  }
  T.post('statuses/update', params, function(err, data, response){
    if(err){
      console.log(err)
    }
    console.log("post successfull!")
  })
}
//this function listens for follows and then replies
stream.on('follow',followed)
function followed(eventMsg){
  console.log("the follow bot is starting")
  var screenName = eventMsg.source.screen_name;
  tweetIt({status: "sup @" + screenName + " thanks for the follow I all the support I can get to make sure @realdonaldtrump keeps getting his daily intake of dicks" });
}
function tweetIt(params){
      T.post('statuses/update', params, tweeted);
      function tweeted(err, data, response){
        if(err){
          console.log("there was an error", err);
        }
        else{
          console.log("it worked!!!")
        }
    }
}

//this will listen out for any mention of whchef
var stream2 = T.stream('statuses/filter', {track: "#whchef"})
  stream2.on('tweet', function(tweet){
    console.log("we found a tweet...");
    var statusObj = {status: "@" +tweet.user.screen_name + " did someone mention me? My ears are burning. Glad to see you got this working ",
                    in_reply_to_status_id: tweet.id_str
    }
    T.post('statuses/update', statusObj, function(err,tweetReply, resp){
      if(err){
        console.log("error in posting", err)
      }
      console.log("it worked!!");
      console.log(tweetReply.text);
    });
  });


//this schedules when to run the breakfast function
var job = new cronJob({
  cronTime: '00 00 05 * * 0-6',
  onTick: function(){
    breakFast();
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();
