(function (window) {
	'use strict'; 
	var KEY = 'todos',
		todos = JSON.parse(get(KEY)) || [],
		oTitle = $('.new-todo'),
		oToDoList = $('.todo-list'),
		oToggleAll = $('#toggle-all'),
		oLabel = $('[for=toggle-all]'),
		oFooter = $('.footer'),
		oCount = $('strong');
	// 初始化
	



	init();
	// 添加 
	oTitle.onkeyup = function(ev) {
		// 如果按下的是回车键 并且 input的值trim完毕之后仍不为空，进行添加操作
		if(ev.keyCode === 13 && this.value.trim()) {
			todos.push({
				id: Date.now(),// 编号
				completed: false,// 状态
				title: this.value.trim()// 名字 
			});
			// 初次渲染  根据数据生成列表结构
			showToDoList(todos,JSON.stringify(todos));
			// 清空input的value
			this.value = '';
			console.log('todos增加了，需要存储了');
			// 存 
			save(KEY,todos);
			// 每添加一次，toggle-all都是不选中
			oToggleAll.checked = false;
			// 如果footer含有hidden这个类，删除掉hidden，这样盒子就显示了
			oFooter.classList.contains('hidden') && oFooter.classList.remove('hidden');
			oLabel.classList.contains('hidden') && oLabel.classList.remove('hidden');

			// 更新未完成todo的数量
			oCount.innerText = unCompletedToDosLength();
		}
	};
	// ul实现事件委托
	oToDoList.onclick = function(ev) {
		// 1. 代理复选框的事件
		if(ev.target.type === 'checkbox') {
			if(ev.target.checked) {
				ev.target.parentNode.parentNode.classList.add('completed');
			}else {
				ev.target.parentNode.parentNode.classList.remove('completed');
			}
			// 获取id，通过data-xxx添加的属性，获取的时候通过元素.dataset.xxx
			var id = Number(ev.target.dataset.id);
			var index = findIndexById(id);
			// 如果找到了，将对应的todo的completed属性与当前复选框的checked属性保持一致
			if(index !== -1) {
				todos[index].completed = ev.target.checked;
			}
			console.log('todo自身的的状态变了，需要存储');
			// 存
			save(KEY,todos);
			// 当所有的todo都被选中了，需要让id是toggle-all这个复选框选中
			oToggleAll.checked = isAllToDoCompleted();

			// 更新未完成todo的数量
			oCount.innerText = unCompletedToDosLength();









		}


		// 2. 代理button的单击事件 因为button有destroy的class，
		if(ev.target.classList.contains('destroy')) {
			// console.log("单击了删除按钮");
			/*
				1. 删除数据 

				2. 删除视图
			*/
			// 1. 删除数据 
			// 获取删除按钮上存储的todo的id
			var id = Number(ev.target.dataset.id);
			// 获取下标 
			var index = findIndexById(id);
			if(index !== -1) {
				todos.splice(index,1);
				// 存
				save(KEY,todos);
				// 没删除一次，需要检测todos是否为空，如果为空，footer隐藏，否则显示
				isEmpty() ? oFooter.classList.add('hidden') : oFooter.classList.remove('hidden') 
				isEmpty() ? oLabel.classList.add('hidden') : oLabel.classList.remove('hidden') 
				// 2. 删除视图
				this.removeChild(ev.target.parentNode.parentNode);
				// 3. 每当删除一个todo，都需要检测其它的todo是否都选中，
				oToggleAll.checked = isAllToDoCompleted();
				// 4. 更新未完成todo的数量
				oCount.innerText = unCompletedToDosLength();
			}
		}
	};
	// 全选复选框的onchange事件
	oToggleAll.onchange = function() {
		// 让所有todo的状态与toggleall的状态保持一致
		for(var i = 0; i < todos.length; i++) {
			todos[i].completed = this.checked;
		}
		console.log('每条todo的状态变了，需要存储');
		// 存
		save(KEY,todos);
		// 更新视图，只需要根据最近todos生成结构即可
		showToDoList(todos);

		// 更新未完成todo的数量
		oCount.innerText = unCompletedToDosLength();
	};
	// 根据数据生成DOM结构 
	function showToDoList(todos) {
		// 先清空
		oToDoList.innerText = '';
		// 在根据todos数组创建todos结构
		var oFrag = document.createDocumentFragment();	// 创建文档碎片
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
			// 在复选框存上储当前todo的id
			oToggle.setAttribute('data-id',todos[i].id.toString());


			oToggle.checked = todos[i].completed;


			oLabel.innerText = todos[i].title;
			oBtn.setAttribute('class','destroy');

			// 在删除按钮上储当前todo的id
			oBtn.setAttribute('data-id',todos[i].id.toString());

			oEdit.setAttribute('class','edit');
			oEdit.setAttribute('value',todos[i].title);
			oDiv.appendChild(oToggle);
			oDiv.appendChild(oLabel);
			oDiv.appendChild(oBtn);
			oLi.appendChild(oDiv);
			oLi.appendChild(oEdit);
			oFrag.appendChild(oLi);
			// 将文档碎片一次添加到ul中
		}
		oToDoList.appendChild(oFrag);
	}
	// 封装存储的方法，根据key存储对应的value
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
	// 取 
	function get(key) {
		return window.localStorage.getItem(key);
	} 
	// 删
	function remove(key) {
		window.localStorage.removeItem(key);
	}






	// 根据id找下标 
	function findIndexById(id) {
		for(var i = 0; i < todos.length; i++) {
			if(todos[i].id === id) {
				return i;
			}
		}
		return -1;
	}
	// 检测todos中每个todo是否都已完成
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

	// 检测todos是否为空
	function isEmpty() {
		return todos.length === 0;
	}

	// 初始化的函数
	function init() {
		oToggleAll.checked = isAllToDoCompleted();
		oTitle.focus();
		// 更新未完成todo的数量
		oCount.innerText = unCompletedToDosLength();
		showToDoList(todos);
		isEmpty() ? oFooter.classList.add('hidden') : oFooter.classList.remove('hidden');
		isEmpty() ? oLabel.classList.add('hidden') :  oLabel.classList.remove('hidden');
	}

	// 计算todos中已完成的todo的数量
	function unCompletedToDosLength() {
		var count = 0;
		for(var i = 0; i < todos.length; i++) {
			if(!todos[i].completed) {
				count++;
			}
		}
		return count;
	}

	// 获取单个元素
	function $(selector,parent) {
		if(!parent) {
			parent = document;
		}
		return parent.querySelector(selector);
	}
	// 获取多个元素
	function $$(selector,parent) {
		if(!parent) {
			parent = document;
		}
		return parent.querySelectorAll(selector);
	}
})(window);
