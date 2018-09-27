var textarea = {
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
		text.onkeypress = function(e) {
			if (e.key in map) {
				map[e.key] = true;
				console.log(map);
				if (e.ctrlKey && map['s']) {
					console.log('save');
					crud.save();
					return false;
				}
				if (e.ctrlKey && map['u']) {
					console.log('new');
					crud.new();
					return false;
				}
				if (e.ctrlKey && map['i']) {
					console.log('delete');
					crud.delete();
					return false;
				}
			}
		};
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
				}
			});
		});
		document.querySelectorAll('.close').forEach(function(e) {
			e.addEventListener('click', function() {
				let modalId = e.parentNode.dataset.modalId;
				console.log(modalId);
				let showHide = document.querySelector('[data-modal-id="' + modalId + '"]');
				let isShown = getComputedStyle(showHide).getPropertyValue('display');
				if (isShown == 'none') {
					showHide.classList.add('active');
				} else {
					showHide.classList.remove('active');
				}
			});
		});
	}
};

modal.click();
var crud = {
	read: function(url, mode, id) {
        if (typeof id != 'undefined') {
            return fetch(url + '?mode=' + mode + '&id=' + id)
            .then((resp)=>resp.json())
            .then(function(data){
                let textarea = document.getElementById('main');
                textarea.innerHTML = data[0].content;
            })
            .catch(function (error) {
                console.log('Request failed', error);
            });  
        }
	},
};
var router = {
    getLocation: ()=>{
        let location = window.location.pathname;
        location = location.split('/');
        location = location[location.length-1]
        return location;
    },
}

if (typeof router.getLocation() != 'undefined' && router.getLocation() != '/') {
    crud.read('../api/paste.inc.php', 'paste', router.getLocation());
    console.log('jako')
}
