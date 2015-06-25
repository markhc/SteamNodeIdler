var Steam = require('steam');
var fs = require('fs');
var accounts = new Array();

function onLogon(bot,index){
    console.log('[STEAM] Logged in on bot ' + index);
    bot.setPersonaState(Steam.EPersonaState.Online);
	//Play a shitton of free games
    bot.gamesPlayed([260430,570,440,363970,230410,304930,323370,346900,236390,301520,
					 333930,260430,227940,226320,238960,339610,273110,109600,218230,243870]);
}

function onSentry(acc,sentryHash,index){
    console.log('[STEAM] Received sentry file for bot ' + index);
	fs.writeFile('sentryFile',sentryHash,function(err) {
	if(err){
	  console.log(err);
	} else {
	  console.log('[FS] Saved sentry file \'' + acc.sentry + '\' to disk.');
	}});
}

function onError(e,index){
    console.log('[STEAM] ERROR - Logon failed for bot ' + index);
	if (e.eresult == Steam.EResult.InvalidPassword) {
		console.log('Reason: invalid password');
	} else if (e.eresult == Steam.EResult.AlreadyLoggedInElsewhere) {
		console.log('Reason: already logged in elsewhere');
	} else if (e.eresult == Steam.EResult.AccountLogonDenied) {
		console.log('Reason: logon denied - steam guard needed');
	}
}


function entryPoint(){
	accounts.push( {login:'login', pass:'pass' });
	//accounts.push( {login:'acc2', pass:'pass2' });
	//accounts.push( {login:'acc3', pass:'pass3' });

	var bots = new Array();
	for (var i = 0; i < accounts.length; i++)
		bots.push(new Steam.SteamClient());

	for (var i = 0; i < accounts.length; i++){
		bots[i].on('loggedOn', onLogon.bind(null, bots[i], i));
		bots[i].on('sentry', onSentry.bind(null, accounts[i], null, i));
		bots[i].on('error', onError.bind(null, null, i));
	}
	for (var i = 0; i < accounts.length; i++){
		if ( fs.existsSync( 'sentryFile' ) ) {
			var sentry = fs.readFileSync( 'sentryFile' );
			console.log( '[STEAM] logging in on account \'' + accounts[i].login + '\' with sentry file' );
			bots[i].logOn({
			  accountName: accounts[i].login,
			  password: accounts[i].pass,
			  shaSentryfile: sentry
			});
		} else {
			for (var i = 0; i < accounts.length; i++){
				console.log( '[STEAM] logging in on account \'' + accounts[i].login + '\' without sentry' );
				bots[i].logOn({
				  accountName: accounts[i].login,
				  password: accounts[i].pass,
				  authCode: 'FYP3B'
				});
			}
		}
	}
}

entryPoint();
  