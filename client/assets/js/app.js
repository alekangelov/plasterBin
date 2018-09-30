hotkeys.filter = function(event) {
	var tagName = (event.target || event.srcElement).tagName;
	hotkeys.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
	return true;
};
var router = {
	getLocation: () => {
		let location = window.location.pathname;
		location = location.split('/');
		location = location[location.length - 1];
		return location;
	},
	pasteLocation: () => {
		return window.location.href;
	},
	goTo: (id) => {
		window.location.pathname = id;
	},
	apiLocation: (get) => {
		let location = window.location.hostname;
		if (typeof get == 'undefined') {
			location = 'http://api.' + location + '/pastes/';
		} else {
			location = 'http://api.' + location + '/pastes/' + get;
		}
		return location;
	}
};

var crud = {
	read: function(url) {
		axios
			.get(url)
			.then(function(response) {
				let text = response.data[0].content;
				let jaks = textarea.thisZ();
				jaks.innerHTML = text;
			})
			.catch(function(error) {
				console.log(error);
			});
	},
	newPaste: function() {
		window.location.pathname = '';
	},
	save: function(url) {
		axios
			.post(url, {
				content: textarea.thisZ().value
			})
			.then(function(response) {
				let lastId = response.data;
				router.goTo(lastId);
			})
			.catch(function(error) {
				console.log(error);
			});
	},
	update: function(jako = []) {
		axios
			.put(jako[0] + jako[1], {
				content: textarea.thisZ().value
			})
			.then(function(response) {
				let lastId = response.data;
				//router.goTo(lastId);
			})
			.catch(function(error) {});
	}
};
var pasteID;
if (router.getLocation() != '') {
	pasteID = router.getLocation();
}

var buttonBar = {
	selector: document.querySelector('.bottomBar'),
	saveB: document.querySelector('#saveButton'),
	newB: document.querySelector('#newButton'),
	deleteB: document.querySelector('#deleteButton'),
	buttons: function() {
		buttonBar.saveB.addEventListener('click', function() {
			if (router.getLocation() != '') {
				crud.update([ router.apiLocation('update/'), pasteID ]);
			} else {
				crud.save(router.apiLocation('add/'));
			}
		});
		buttonBar.newB.addEventListener('click', function() {
			crud.newPaste();
		});
	}
};
buttonBar.buttons();
var textarea = {
	thisZ: function() {
		return document.getElementById('main');
	},
	input: function(id) {
		var textarea = document.getElementById(id);
		textarea.onkeydown = function(e) {
			if (e.keyCode === 9) {
				var index = this.selectionStart;
				this.value = [ this.value.slice(0, index), '\t', this.value.slice(index) ].join('');
				this.selectionStart = index + 1;
				this.selectionEnd = index + 1;
				return false;
			}
		};
	},
	shortcuts: function(id) {
		let text = document.getElementById(id);
		var map = { s: false, u: false, i: false };
		var pasteId = router.getLocation();
		hotkeys('ctrl+s, command+s, ctrl+f, command+f, ctrl+d, command+d', function(event, handler) {
			event.preventDefault();
			switch (handler.key) {
				case 'ctrl+s':
				case 'command+s':
					if (router.getLocation() != '') {
						crud.update([ router.apiLocation('update/'), pasteID ]);
						updates.init();
					} else {
						crud.save(router.apiLocation('add/'));
					}
					return false;
				case 'ctrl+d':
				case 'command+d':
					crud.newPaste();
					return false;
				case 'ctrl+f':
				case 'command+f':
					if (router.getLocation() != '') {
						crud.newPaste();
					} else {
						crud.delete(router.apiLocation('delete/'), pasteID);
					}
					return false;
				default:
					break;
			}
		});
		text.onkeyup = function(e) {
			if (e.key in map) {
				if (map['Control']) {
					map['Meta'] = map['Control'];
				} else if (map['Meta']) {
					map['Control'] = map['Meta'];
				}
				map[e.key] = false;
			}
		};
	}
};

textarea.input('main');
textarea.shortcuts('main');

var modal = {
	copyId: function() {
		let copyBox = document.querySelector('#pasteId');
		let tooltip = document.querySelector('#tooltip');
		if (router.getLocation() != '') {
			copyBox.value = router.pasteLocation();
		} else {
			copyBox.style.display = 'none';
		}
		copyBox.addEventListener('click', () => {
			copyBox.select();
			document.execCommand('copy');
		});
		copyBox.addEventListener('mouseover', () => {
			tooltip.style.opacity = '1';
		});
		copyBox.addEventListener('mouseout', () => {
			tooltip.style.opacity = '0';
		});
	},
	click: function() {
		document.querySelectorAll('[data-modal]').forEach(function(e) {
			e.addEventListener('click', function() {
				let modalId = e.dataset.modal;
				let showHide = document.querySelector('[data-modal-id="' + modalId + '"]');
				let isShown = getComputedStyle(showHide).getPropertyValue('display');
				if (isShown == 'none') {
					showHide.classList.add('active');
				} else {
					showHide.classList.remove('active');
					showHide.style.display = 'block';
					setTimeout(function() {
						showHide.style = '';
					}, 500);
				}
			});
		});
		document.querySelectorAll('.close').forEach(function(e) {
			e.addEventListener('click', function() {
				let modalId = e.parentNode.dataset.modalId;

				let showHide = document.querySelector('[data-modal-id="' + modalId + '"]');
				let isShown = getComputedStyle(showHide).getPropertyValue('display');
				if (isShown == 'none') {
					showHide.classList.add('active');
				} else {
					showHide.classList.remove('active');
					showHide.style.display = 'block';
					setTimeout(function() {
						showHide.style = '';
					}, 500);
				}
			});
		});
	},
	init: () => {
		modal.click();
		modal.copyId();
	}
};

modal.init();

if (typeof router.getLocation() != 'undefined' && router.getLocation() != '/' && router.getLocation() != '') {
	crud.read(router.apiLocation(router.getLocation()));
}

let dark = false;
if (localStorage.getItem('dark') == 'true') {
	document.querySelector('body').classList.add('dark');
	dark = true;
}

hotkeys('command+shift+p, ctrl+shift+p', function(event) {
	event.preventDefault();
	let darkCss = '<link rel="stylesheet" id="darkCss" href="assets/css/dark.css">';
	if (dark == false) {
		document.querySelector('body').classList.add('dark');
		dark = true;
		localStorage.setItem('dark', 'true');
	} else {
		document.querySelector('body').classList.remove('dark');
		dark = false;
		localStorage.setItem('dark', 'false');
	}
	return false;
});

let updates = {
	notification: document.querySelector('.notification'),
	notificationSaved: "Plaster Saved",
	notificationDeleted: 'Plaster Deleted',
	notificationNew: 'New Plaster',
	pasteSaved: function(id) {
		setTimeout(() => {
			updates.notification.innerHTML = id;
			updates.notification.style.display = 'block';
			updates.notification.classList.add('active');
		}, 100);
		setTimeout(()=>{
			updates.notification.classList.remove('active');
			setTimeout(() => {
				updates.notification.style.display = 'none';
			}, 500);
		}, 2000)
	},
	init: () => {
		if (router.getLocation() == '') {
			updates.pasteSaved(updates.notificationNew);
		} else {
			updates.pasteSaved(updates.notificationSaved);
		}
	}
}

updates.init();