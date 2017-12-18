
; (function () {
	// const todos = [
	// 	{
	// 		id: 1,
	// 		title: '吃饭',
	// 		completed: true
	// 	},
	// 	{
	// 		id: 2,
	// 		title: '睡觉',
	// 		completed: false
	// 	},
	// 	{
	// 		id: 3,
	// 		title: '打豆豆',
	// 		completed: false
	// 	}
	// ]

	// 自定义属性- v-focus 聚焦

	Vue.directive('focus',{
		inserted:function(el){
			el.focus()
		}
	})

	Vue.directive('todo-focus',{
		update:function(el,binding){
			// console.log(binding.value)
			if(binding.value){
				el.focus()
			}
		}
	})


	window.app = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,
			filterText: 'all'
		},
		// 计算属性,缓存计算结果，只能当属性来用，不能当作方法
		computed: {
			//简写
			// remaningCount(){
			// 	return this.todos.filter(t => !t.completed).length
			// }
			remaningCount: {
				get() {
					return this.todos.filter(t => !t.completed).length
				},
				set() {
					console.log('remaningCount 的 set 方法被调用了')
				}
			},

			toggleAllStat: {
				get() {
					return this.todos.every(t => t.completed)
				},
				set() {
					const checked = !this.toggleAllStat
					console.log(checked)
					this.todos.forEach(function (item) {
						item.completed = checked
					})
				}
			},

			filterTodos() {
				switch (this.filterText) {
					case 'active':
						return this.todos.filter(t => !t.completed)
						break
					case 'completed':
						return this.todos.filter(t => t.completed)
						break
					default:
						return this.todos
						break
				}
			}

		},

		//侦听
		watch: {
			todos: {
				handler(val, oldVal) {
					window.localStorage.setItem('todos', JSON.stringify(val))
				},
				deep: true,
			}
		},

		methods: {
			handleNewTodoKeyDown(e) {
				// 0.注册按下的回车事件
				// 1.获取文本框的内容
				// 2.数据校验
				// 3.添加到 todos 列表
				const value = e.target.value.trim()
				if (!value.length) {
					return
				}
				const todos = this.todos
				todos.push({
					id: todos.length ? todos[todos.length - 1].id + 1 : 1,
					title: value,
					completed: false
				})
				e.target.value = ''
			},

			handleToggleAllChange(e) {
				// 0.绑定checkbox的change事件
				// 1.获取 checkbox 的选中的状态 e.target.checked
				// 2.直接循环所有子任务项的选中状态设置为toggleAll的状态
				const checked = e.target.checked
				this.todos.forEach(function (item) {
					item.completed = checked
				})

			},

			handleRemoveTodoClick(index, e) {
				this.todos.splice(index, 1)
			},

			handleGetEditingDblClick(todo) {
				// 把这个变量等于当前双击的 todo
				this.currentEditing = todo
			},

			handleSaveEditingKeyDown(todo, index, e) {
				// 0.注册绑定事件处理函数
				// 1.获取编辑文本框数据
				// 2.数据校验
				// 		如果数据为空，则直接删除该元素
				// 		否则保存编辑
				const target = e.target
				const value = target.value.trim()

				if (!value.length) {
					this.todos.splice(index, 1)
				} else {
					todo.title = value
					this.currentEditing = null
				}
				// console.log(todo)
			},

			handleCancleEditingEsc() {
				this.currentEditing = null
			},

			handleClickAllDoneClick() {
				// 不要在forEach循环中删除数组元素，会导致索引错乱
				// this.todos.forEach((item,index) => {
				// 	if(item.completed){
				// 		this.todos.splice(index,1)
				// 	}
				// })

				// 在for循环中删除 数组元素，手动修改索引
				// for (let i = 0; i < this.todos.length; i++) {
				// 	if (this.todos[i].completed) {
				// 		this.todos.splice(i, 1)
				// 		i--
				// 	}
				// }

				// 过滤结果的方式
				this.todos = this.todos.filter(t => !t.completed)

			},

			getRemaningCount() {
				return this.todos.filter(t => !t.completed).length
			}
		}
	}).$mount('#app')

	// 注册hash的改变事件
	window.onhashchange = handleHashChange
	handleHashChange()
	function handleHashChange() {
		app.filterText = window.location.hash.substr(2)
	}

})()
