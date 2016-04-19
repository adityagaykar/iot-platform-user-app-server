var servers = {
	iot_platform: {
		hostname: "localhost",
		port: 3000
	},
	user_app_server: {
		hostname: "localhost",
		port: 3001
	},
	logic_server:{
		hostname: "localhost",
		port: 3002
	},
	event_server:{
		hostname: "localhost",
		port: 3003
	},
	notification_server:{
		hostname: "10.1.129.29",
		port: 5000
	},
	data_server: {
		hostname: "localhost",
		port: 3005
	},
	data_listener : {
		hostname: "localhost",
		port: 3006
	},
	db_server : {
		hostname : "localhost"
	}

}

module.exports = servers;