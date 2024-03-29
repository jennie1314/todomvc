(function (window) {
	'use strict'; 
	var KEY = 'todos',
		todos = JSON.parse(get(KEY)) || [],
		oTitle = $('.new-todo'),
		oToDoList = $('.todo-list'),
		oToggleAll = $('#toggle-all'),
		oLabel = $('[for=toggle-all]'),
		oFooter = $('.footer'),
		oCount = $('strong'),
		oClear = $('.clear-completed'),
		aTab = $$('.footer .filters li a');
	init();
	oTitle.onkeyup = function(ev) {
		if(ev.keyCode === 13 && this.value.trim()) {
			todos.push({
				id: Date.now(),
				completed: false,
				title: this.value.trim()
			});
			showToDoList(todos,JSON.stringify(todos));
			this.value = '';
			save(KEY,todos);
			oToggleAll.checked = false;
			oFooter.classList.contains('hidden') && oFooter.classList.remove('hidden');
			oLabel.classList.contains('hidden') && oLabel.classList.remove('hidden');
			oCount.innerText = unCompletedToDosLength();
			clearCompletedElementVisible();
		}
	};
	oToDoList.onclick = function(ev) {
		if(ev.target.type === 'checkbox') {
			if(ev.target.checked) {
				ev.target.parentNode.parentNode.classList.add('completed');
			}else {
				ev.target.parentNode.parentNode.classList.remove('completed');
			}
			var id = Number(ev.target.dataset.id);
			var index = findIndexById(id);
			if(index !== -1) {
				todos[index].completed = ev.target.checked;
			}
			save(KEY,todos);
			oToggleAll.checked = isAllToDoCompleted();
			oCount.innerText = unCompletedToDosLength();
			clearCompletedElementVisible();
			showToDoList(doFilter($('a.selected').getAttribute('type')));
		}
		if(ev.target.classList.contains('destroy')) {
			var id = Number(ev.target.dataset.id);
			var index = findIndexById(id);
			if(index !== -1) {
				todos.splice(index,1);
				save(KEY,todos);
				isEmpty() ? oFooter.classList.add('hidden') : oFooter.classList.remove('hidden') 
				isEmpty() ? oLabel.classList.add('hidden') : oLabel.classList.remove('hidden') 
				this.removeChild(ev.target.parentNode.parentNode);
				oToggleAll.checked = isAllToDoCompleted();
				oCount.innerText = unCompletedToDosLength();
				clearCompletedElementVisible();
			}

		}
	};
	oToggleAll.onchange = function() {
		for(var i = 0; i < todos.length; i++) {
			todos[i].completed = this.checked;
		}
		save(KEY,todos);
		showToDoList(todos);
		oCount.innerText = unCompletedToDosLength();
		clearCompletedElementVisible();
		showToDoList(doFilter($('a.selected').getAttribute('type')));
	};
	function showToDoList(todos) {
		oToDoList.innerText = '';
		var oFrag = document.createDocumentFragment();
		for(var i = 0; i < todos.length; i++) {
			var oLi = document.createElement('li');
			var oDiv = document.createElement('div');
			var oToggle = document.createElement('input');
			var oLabel = document.createElement('label');
			var oBtn = document.createElement('button');
			var oEdit = document.createElement('input');
			todos[i].completed ? oLi.classList.add('completed') : oLi.classList.remove('completed')
			oDiv.setAttribute('class','view');
			oToggle.setAttribute('class','toggle');
			oToggle.setAttribute('type','checkbox');
			oToggle.setAttribute('data-id',todos[i].id.toString());
			oToggle.checked = todos[i].completed;
			oLabel.innerText = todos[i].title;
			oBtn.setAttribute('class','destroy');
			oBtn.setAttribute('data-id',todos[i].id.toString());
			oEdit.setAttribute('class','edit');
			oEdit.setAttribute('value',todos[i].title);
			oDiv.appendChild(oToggle);
			oDiv.appendChild(oLabel);
			oDiv.appendChild(oBtn);
			oLi.appendChild(oDiv);
			oLi.appendChild(oEdit);
			oFrag.appendChild(oLi);
		}
		oToDoList.appendChild(oFrag);
	}
	function save(key,value) {
		var v = null;
		if(typeof value !== 'string') {
			if(typeof value === 'object') {
				v = JSON.stringify(value);
			}else {
				v = value.toString();
			}
			return window.localStorage.setItem(key,v);
		}
		window.localStorage.setItem(key,value);
	}
	function get(key) {

		return window.localStorage.getItem(key);
	} 
	function remove(key) {

		window.localStorage.removeItem(key);
	}
	function findIndexById(id) {
		for(var i = 0; i < todos.length; i++) {
			if(todos[i].id === id) {
				return i;
			}
		}
		return -1;
	}
	function isAllToDoCompleted() {
		var flag = true;
		for(var i = 0; i < todos.length; i++) {
			if(!todos[i].completed) {
				flag = false;
				break;
			}
		}
		return flag;
	}
	function isEmpty() {

		return todos.length === 0;
	}
	function init() {
		oToggleAll.checked = isAllToDoCompleted();
		oTitle.focus();
		oCount.innerText = unCompletedToDosLength();
		showToDoList(todos);
		isEmpty() ? oFooter.classList.add('hidden') : oFooter.classList.remove('hidden');
		isEmpty() ? oLabel.classList.add('hidden') :  oLabel.classList.remove('hidden');
		clearCompletedElementVisible()
	}
	function unCompletedToDosLength() {
		var count = 0;
		for(var i = 0; i < todos.length; i++) {
			if(!todos[i].completed) {
				count++;
			}
		}
		return count;
	}
	function hasCompletedToDo() {
		for(var i = 0; i < todos.length; i++) {
			if(todos[i].completed) {
				return true;
			}
		}
		return false;
	}
	function clearCompletedElementVisible() {
		hasCompletedToDo() ? 
			oClear.classList.remove('hidden') : 
			oClear.classList.add('hidden')
	}
	oClear.onclick = function() {
		for(var i = 0; i < todos.length;i++) {
			if(todos[i].completed) {
				todos.splice(i,1);
				i--;
			}
		}
		save(KEY,todos);
		showToDoList(todos);
		this.classList.add('hidden');
	};
	for(var i = 0; i < aTab.length; i++) {
		aTab[i].onclick = function() {
			for(var j = 0; j < aTab.length; j++) {
				aTab[j].classList.remove('selected');
			}
			this.classList.add('selected');
			var type = this.getAttribute('type');
			showToDoList(doFilter(type));
		};
	} 
	function doFilter(type) {
		var filteredToDos = [];
		switch(type) {
			case 'all':
				filteredToDos = todos;
				break;
			case 'active':
				for(var i = 0; i < todos.length; i++) {
					if(!todos[i].completed) {
						filteredToDos.push(todos[i]);
					}
				}
				break;
			case 'completed':
				for(var i = 0; i < todos.length; i++) {
					if(todos[i].completed) {
						filteredToDos.push(todos[i]);
					}
				}
				break;
		}
		return filteredToDos;
	}
	function $(selector,parent) {
		if(!parent) {
			parent = document;
		}
		return parent.querySelector(selector);
	}
	function $$(selector,parent) {
		if(!parent) {
			parent = document;
		}
		return parent.querySelectorAll(selector);
	}
})(window);
