var phantom = require('phantom');
var cheerio = require('cheerio');
var robot = require('robotjs');
var open = require('open');


function run() {
	var sitepage = null;
	var phInstance = null;
	phantom.create()
	    .then(instance => {
	        phInstance = instance;
	        return instance.createPage();
	    })
	    .then(page => {
	        sitepage = page;
	        return page.open('http://pokesnipers.com/');
	    })
	    .then(status => {
	    	console.log('[STATUS] ', status);
	        return sitepage.property('content');
	    })
	    .then(content => {
	        var $ = cheerio.load(content);
	        console.log('[INFO] Running........');

	        var firstPkmUrl = $('#pokemon-list li:nth-child(1) span.secondary-content a').attr('href');
	        console.log('[INFO] Catching Pokemon at ', firstPkmUrl);
			openUrl(firstPkmUrl);

	        sitepage.close();
	        phInstance.exit();
	    })
	    .catch(error => {
	        console.log(error);
	        phInstance.exit();
	    });
}

function openUrl(url) {
	open(url, function (err) {
	  if (err) throw err;
	  	// Open the Sniper Window
		setTimeout(function() {
			console.log('[INFO] Opening URL at ', url);
			pressEnter();
		}, 5000);

		// Close the Sniper Window
		setTimeout(function() {
			console.log('[INFO] Closing Sniper.');
			pressEnter();
			console.log('------------------------------');
		}, 5000);
	});
}

function pressEnter() {
	//Press enter. 
	robot.keyTap("enter");
	console.log('[INFO] Auto Press Enter.');
}


var CronJob = require('cron').CronJob;
var job = new CronJob('*/30 * * * * *', function() {
  /*
   * Runs every minute
   */
  	run();
  }, function () {
    /* This function is executed when the job stops */
    console.log('[INFO] Cron exits after Snipping.');
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);