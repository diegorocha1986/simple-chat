(function(win, doc, undefined){
	
	'use strict';

	var Chat = {
		vars: {
			socket: null,
			username: null,
			isLogged: false
		},
		cache: {
			modal: $('.modal'),
			controls: $('.controls'),
			usersList: $('.js-users'),
			usersCount: $('.js-users-count'),
			messagesList: $('.js-messages')
		},
		init: function(){
			Chat.vars.socket = io.connect('http://10.70.130.98:3000');
			Chat.bind.init.call();
			Chat.listen.init.call();
		},
		bind: {
			init: function(){
				win.addEventListener('unload', Chat.functions.disconnectUser);
				Chat.cache.modal.find('.mdl-js-button').on('click', Chat.functions.setUsername);
				Chat.cache.controls.find('.mdl-js-button').on('click', Chat.functions.sendMessage);
			}
		},
		listen: {
			init: function(){
				Chat.vars.socket.on('login', Chat.functions.handleLogin);
				Chat.vars.socket.on('user joined', Chat.functions.handleNewUser);
				Chat.vars.socket.on('new message', Chat.functions.handleNewMessage);
			}
		},
		functions: {
			disconnectUser: function(e){
				Chat.vars.socket.emit('disconnect user', Chat.vars.username);
			},
			setUsername: function(e){
				var input = doc.getElementById('nickname');

				e.preventDefault();
				Chat.cache.modal.fadeOut();
				Chat.vars.username = input.value;
				Chat.vars.socket.emit('add user', input.value);
			},
			handleLogin: function(data){
				var userNode = Chat.functions.createUserNode(Chat.vars.username);

				Chat.vars.isLogged = true;
				Chat.cache.usersCount.attr('data-badge', data.numUsers);
				Chat.cache.usersList.append(userNode);
			},
			handleNewUser: function(data){
				var userNode = Chat.functions.createUserNode(data.user),
					messageNode = Chat.functions.createMessageNode(data.user, ' has joined the chat.');

				Chat.cache.usersCount.attr('data-badge', data.numUsers);
				Chat.cache.usersList.append(userNode);
				Chat.cache.messagesList.append(messageNode);
			},
			handleNewMessage: function(data){
				var messageNode = Chat.functions.createMessageNode(data.user, data.message);

				Chat.cache.messagesList.append(messageNode);
			},
			sendMessage: function(e){
				var input = doc.getElementById('message'),
					message = input.value,
					messageNode = Chat.functions.createMessageNode(Chat.vars.username, message);

				e.preventDefault();
				input.value = '';
				input.focus();
				Chat.cache.messagesList.append(messageNode);
				Chat.vars.socket.emit('new message', {
					user: Chat.vars.username,
					message: message
				});
			},
			createUserNode: function(user){
				var fragment = doc.createDocumentFragment(),
					paragraph = doc.createElement('p'),
					icon = doc.createElement('i'),
					userSpan = doc.createElement('span');

				icon.className = 'material-icons';
				icon.appendChild(doc.createTextNode('person'));

				userSpan.appendChild(doc.createTextNode(user));

				paragraph.className = 'user';
				paragraph.setAttribute('data-user', user);
				paragraph.appendChild(icon);
				paragraph.appendChild(userSpan);

				fragment.appendChild(paragraph);

				return fragment;
			},
			createMessageNode: function(user, message){
				var fragment = doc.createDocumentFragment(),
					paragraph = doc.createElement('p'),
					userSpan = doc.createElement('span'),
					msgSpan = doc.createElement('span');

				userSpan.className = 'user mdl-shadow--2dp';
				userSpan.appendChild(doc.createTextNode(user + ':'));

				msgSpan.className = 'message';
				msgSpan.appendChild(doc.createTextNode(' ' + message));

				paragraph.className = 'message-block mdl-typography--subhead';
				paragraph.appendChild(userSpan);
				paragraph.appendChild(msgSpan);

				fragment.appendChild(paragraph);

				return fragment;
			}
		}
	}

	Chat.init.call();

}(window, document));
