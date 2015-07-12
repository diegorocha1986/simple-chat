(function(win, doc, undefined){

	var Chat = {
		socket: null,
		init: function(){
			Chat.socket = io.connect('http://localhost:3000');
		},
		functions: {
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