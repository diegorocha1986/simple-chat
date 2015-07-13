(function(win, doc, undefined){
	
	'use strict';

	var Chat = {
		vars: {
			socket: null,
			isLogged: false
		},
		cache: {
			modal: $('.modal')
		},
		init: function(){
			Chat.vars.socket = io.connect('http://localhost:3000');
			Chat.bind.init.call();
			Chat.listen.init.call();
		},
		bind: {
			init: function(){
				win.addEventListener('unload', Chat.functions.disconnectUser);
				Chat.cache.modal.find('.mdl-js-button').on('click', Chat.functions.setUsername);
			}
		},
		listen: {
			init: function(){
				Chat.vars.socket.on('login', Chat.functions.handleLogin);
			}
		},
		functions: {
			setUsername: function(e){
				var input = doc.getElementById('nickname');

				e.preventDefault();
				Chat.cache.modal.fadeOut();
				Chat.vars.socket.emit('add user', input.value);
			},
			handleLogin: function(data){
				Chat.vars.isLogged = true;
			},
			createUserNode: function(user){
				var fragment = doc.createDocumentFragment,
					paragraph = doc.createElement('p'),
					icon = doc.createElement('i'),
					userSpan = doc.createElement('span');

				icon.className = 'material-icons';
				icon.appendChild(doc.createTextNode('person'));

				userSpan.appendChild(doc.createTextNode(user));

				paragraph.className = 'user';
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
				msgSpan.appendChild(doc.createTextNode(message));

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