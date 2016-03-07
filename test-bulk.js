
var http = require('http');
var querystring = require('querystring');

var xml = [
'<message>',

'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rhoncus ut leo sit amet fringilla. Cras ultrices aliquet metus, a tristique metus. Duis id ligula eleifend, molestie arcu sed, scelerisque nisi. Proin eget lacus at ante euismod molestie. Nunc urna odio, feugiat ac erat finibus, mollis viverra libero. Maecenas ac urna facilisis, elementum erat eget, suscipit nibh. Nullam posuere ullamcorper libero, id dapibus dui tempus et. Nam iaculis ipsum id ante fermentum, vel auctor arcu pharetra. Proin consectetur arcu metus, et mattis ex cursus et. Donec a ex in ipsum faucibus lacinia. Maecenas tincidunt rutrum nunc nec interdum. Mauris sit amet blandit tellus, at pharetra lectus. Donec non suscipit dolor.',

'Vestibulum vel ipsum ornare, luctus metus quis, tincidunt purus. Quisque nisi elit, fringilla vitae erat at, blandit malesuada augue. Mauris interdum mauris id orci bibendum, quis venenatis eros laoreet. Donec lobortis consectetur aliquet. Proin vehicula ex justo, eu efficitur ex consectetur sit amet. Suspendisse potenti. Nunc a dui tempor, condimentum felis ut, pharetra nisi. Nulla facilisi. Praesent lacinia sed turpis sit amet convallis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla dapibus tortor in ligula mollis auctor. Pellentesque porttitor a mi non suscipit. Sed sollicitudin mi sed tortor varius, ac vehicula ipsum commodo. Fusce placerat, nisi vel aliquet ornare, metus augue tempor massa, sit amet congue velit felis et eros. Aenean vulputate quam urna, eget finibus arcu molestie vitae.',

'Curabitur at massa quis magna sagittis vulputate quis sed urna. Donec a ante ut ipsum eleifend commodo. Sed tincidunt, nisi vitae tempor mollis, metus nunc venenatis justo, eget varius neque est eu lectus. Vestibulum facilisis quam et ornare viverra. Cras bibendum, sem a maximus scelerisque, arcu leo elementum mi, eleifend dapibus dolor elit sit amet leo. Praesent leo orci, malesuada in augue a, euismod tristique quam. Nunc eu auctor lorem. Mauris semper, orci at ultricies porttitor, ipsum metus malesuada tortor, id imperdiet risus mauris a nisi.',

'</message>'
].join('\n');


var id = 0;

var sent = 0;
var recieved = 0;

function fire () {
  sent++;
  
  var postData = xml.replace('{{ID}}', (++id)+'');
  
  var options = {
    hostname: '127.0.0.1',
    port: 8889,
    path: '/resources',
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'Content-Length': postData.length
    }
  };
  
  var req = http.request(options, function(res) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
    });
    res.on('end', function() {
      //console.log('No more data in response.')
      recieved++;
    })
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  // write data to request body
  req.write(postData);
  req.end();
}

var mps = (process.argv[2] != null && process.argv[2] != undefined)? process.argv[2] : 2;
var total = (process.argv[3] != null && process.argv[3] != undefined)? process.argv[3] : 10;


console.log('starting with ', mps, ' messages per seccond, for ', total, ' messages');

var timer = setInterval(function() {
	if (sent >= total) {
		clearInterval(timer);
		return;
	}
	
  fire();
}, (1000.0/mps));


var logTimer = setInterval(function() {
	console.log('sent: ', sent, ' recieved: ', recieved, ' total: ', total);
  
  if (recieved >= total) {
    clearInterval(logTimer);
    return;
  }
}, 500)
