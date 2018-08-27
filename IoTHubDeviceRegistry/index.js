module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var iothub = require('azure-iothub');
    var connectionString = 'HostName=IoTHub-DeviceTwin.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=WlSuFxkm9hg0hulTVZ0cjLC7JC6Ol42JSlo9Yel8zzs=';
    var Authenticate = "Advantech";
    var registry = iothub.Registry.fromConnectionString(connectionString);
    var HostName = iothub.ConnectionString.parse(connectionString).HostName;
    var DeviceId;

    if(req.body['Authenticate'] == Authenticate)
    {
        context.log('Authenticate Success'); 
		context.log('DeviceId:' + req.body['DeviceId']); 
        DeviceId = req.body['DeviceId'];
        var device = {deviceId: req.body['DeviceId']};
        registry.create(device, function(err, deviceInfo, res) {
            if (err)
            {	
                /*
                context.log('Error: ' + err.toString());
                res = {
                    status: 200,
                    body: err.toString()
                };
                context.done(null, res);*/
                registry.get(DeviceId, function(err, deviceInfo, res) {
                    if (deviceInfo) 
                    {

                        var DeviceConnectString = "HostName="+ HostName +";DeviceId=" + deviceInfo["deviceId"] + ";SharedAccessKey=" + deviceInfo["authentication"]["symmetricKey"]["primaryKey"];
                        res = {status: 200, body: DeviceConnectString};
                        context.done(null, res);
                    }
				});
            }
            else
            {
                if (res) console.log('status: ' + res.statusCode + ' ' + res.statusMessage);
                if (deviceInfo) 
                {
                    var DeviceConnectString = "HostName="+ HostName +";DeviceId=" + deviceInfo["deviceId"] + ";SharedAccessKey=" + deviceInfo["authentication"]["symmetricKey"]["primaryKey"];
                    res = {status: 200, body: DeviceConnectString};
                    context.done(null, res);
                }
            }
        }); 
    }
    else
	{
		res = {status: 401, body: 'Authenticate Fail'};
        context.done(null, res);
	}
};