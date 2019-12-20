(function (window) {
	'use strict'; 

	/*
		一个全局的数组，存储所有todos的信息 
		每添加一次，都向数组中push一个对象，并且该对象包含两个必须的属性
		id： 一个唯一的标识（可以是数字，也可以是字符串），不重复即可
		状态：标志当前todo是否完成
		名字：输入的值

	*/
	// 	全局的数组，存储所有todos的信息 
	var todos = [],
		oTitle = $('.new-todo'),
		oToDoList = $('.todo-list'),
		oToggleAll = $('#toggle-all');
	// 监听按键抬起事件
	oTitle.onkeyup = function(ev) {
		// 如果按下的是回车键 并且 input的值trim完毕之后仍不为空，进行添加操作
		if(ev.keyCode === 13 && this.value.trim()) {
			// 向数组中push一个对象
			todos.push({
				// 编号
				id: Date.now(),
				// 状态
				completed: false,
				// 名字 
				title: this.value.trim()
			});
			// 初次渲染  根据数据生成列表结构
			showToDoList(todos)
			// var oFrag = document.createDocumentFragment();	// 创建文档碎片
			// var oLi = document.createElement('li');
			// var oDiv = document.createElement('div');
			// var oToggle = document.createElement('input');
			// var oLabel = document.createElement('label');
			// var oBtn = document.createElement('button');
			// var oEdit = document.createElement('input');
			// oDiv.setAttribute('class','view');
			// oToggle.setAttribute('class','toggle');
			// oToggle.setAttribute('type','checkbox');
			// // 在复选框存储当前todo的id
			// oToggle.setAttribute('data-id', timestamp.toString());
			// oLabel.innerText = this.value.trim();
			// oBtn.setAttribute('class','destroy');
			// oEdit.setAttribute('class','edit');
			// oEdit.setAttribute('value',this.value.trim());
			// oDiv.appendChild(oToggle);
			// oDiv.appendChild(oLabel);
			// oDiv.appendChild(oBtn);
			// oLi.appendChild(oDiv);
			// oLi.appendChild(oEdit);
			// oFrag.appendChild(oLi);

			// // 将文档碎片一次添加到ul中
			// oToDoList.appendChild(oFrag);

			// 清空input的value
			this.value = '';


			// 把数据展示出来




















			/*
				每个todo的状态的变化，如果被勾上，
				表示完成，要给li添加completed的class，
				否则移除completed的class
			*/
			// 事件委托
			/*
				当每条todo的状态发生变化的时候，需要给li添加或者completed这个类
				选中就添加，否则就移除，但是由于

			*/
			oToDoList.onclick = function(ev) {
				if(ev.target.type === 'checkbox') {
					if(ev.target.checked) {
						// 让视图更新
						ev.target.parentNode.parentNode.classList.add('completed');
						// 让数据更新  让复选框的下标与todo的下标保持一致
						// 问题： 如何知道复选框的下标呢？
						// 取出复选框存储的id值
					}else {
						// 让视图更新
						ev.target.parentNode.parentNode.classList.remove('completed');
					}
					// 获取id，通过data-xxx添加的属性，获取的时候通过元素.dataset.xxx
					var id = Number(ev.target.dataset.id);
					var index = -1;
					// 根据id去找当前todo在todos数组中的下标
					for(var i = 0; i < todos.length; i++) {
						if(todos[i].id === id) {
							index = i;
							break;
						}
					}
					// 如果找到了，将对应的todo的completed属性与当前复选框的checked属性保持一致
					if(index !== -1) {
						todos[index].completed = ev.target.checked;
					}

					// 当所有的todo都被选中了，需要让id是toggle-all这个复选框选中
					var flag = true;
					for(i = 0; i < todos.length; i++) {
						if(!todos[i].completed) {
							flag = false;
							break;
						}
					}
					oToggleAll.checked = flag;
				}
			};


















		}
	};

	// 监听toggleall的onchange事件
	/*
		做的事：
			1. 控制所有todo的全选和全不选
	*/

	oToggleAll.onchange = function() {
		// 让所有todo的状态与toggleall的状态保持一致
		for(var i = 0; i < todos.length; i++) {
			todos[i].completed = this.checked;
		}
		// 更新视图，只需要根据最近todos生成结构即可
		showToDoList(todos);
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
			oDiv.setAttribute('class','view');
			oToggle.setAttribute('class','toggle');
			oToggle.setAttribute('type','checkbox');
			// 在复选框存储当前todo的id
			oToggle.setAttribute('data-id',todos[i].id.toString());
			oLabel.innerText = todos[i].title;
			oBtn.setAttribute('class','destroy');
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











	// 添加 



	// 封装两个获取元素的方法

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
