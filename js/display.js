var swiper = null;
var tick = 0; //排名更新系数
var backIndex = 1; //图片更换系数
let vue = new Vue({
	el: '#app',
	data: {
		info: '',
		manGroup: [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		],
		manGroup2: [],
		womanGroup: [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		],
		womanGroup2: [],
		mixedGroup: [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		],
		mixedGroup2: [],
	},
	methods: {
		readInfo: function() {
			var that = this;
			that.manGroup = that.manGroup2;
			that.womanGroup = that.womanGroup2;
			that.mixedGroup = that.mixedGroup2;
			setInterval(function() {
				that.manGroup = that.manGroup2;
				that.womanGroup = that.womanGroup2;
				that.mixedGroup = that.mixedGroup2;
				// // for (var i = 0; i < that.manGroup2.length; i++) {
				// // 	that.manGroup.push(that.manGroup2[i])
				// // }
				// that.womanGroup=[];
				// for (var i = 0; i < that.womanGroup2.length; i++) {
				// 	that.womanGroup.push(that.womanGroup2[i])
				// }

			}, 1000)
		},
		getData: function() {
			var that = this;
			$.ajax({
				type: "get",
				url: "data/display.json",
				// url: "http://www.chongwunet.com/activity/showallmsg_pc",
				success: function(result) {
					if (typeof(result) == 'string')
						result = JSON.parse(result)
					if (result.state) {
						var info = result.info;
						resetGroup(info.manGroup);
						that.manGroup2 = split_array2(info.manGroup, 10);

						resetGroup(info.womanGroup);
						that.womanGroup2 = split_array2(info.womanGroup, 10)

						var group = info.mixedGroup;
						for (let i = 0; i < group.length; i++) {
							group[i].phone = resetPhone(group[i].phone)
						}
						that.mixedGroup2 = split_array2(info.mixedGroup, 10)

						that.info = info;

						setTimeout(function() {
							that.readInfo()
							//that.$forceUpdate();
						}, 200)

						console.log("排名刷新成功，时间：" + dateFormat("yyyy-MM-dd HH:mm:ss",
							new Date()));
						that.initSwiper();

					} else {
						mui.alert(result.msg);
					}
				},
				error: function(obj, errorInfo) {
					console.log(errorInfo)
				}
			});
		},
		initSwiper: function() {
			var that = this;
			if (!swiper) {
				setTimeout(function() {
					swiper = new Swiper('.swiper-container', {
						loop: true,
						effect: 'flip',
						direction: 'vertical',
						grabCursor: true,
						observer: true, //修改swiper自己或子元素时，自动初始化swiper
						//observeParents: true, //修改swiper的父元素时，自动初始化swiper
					});
				}, 100);
				setInterval(function() {
					var i = tick % 100;
					var page = Math.floor(tick / 100);
					if (i < 10) {
						if (that.info.manGroup.length > 10 ||
							that.info.womanGroup.length > 10 ||
							that.info.mixedGroup.length > 10) {
							swiper[i].slideTo(page);
							swiper[i + 10].slideTo(page);
							swiper[i + 20].slideTo(page);
							// swiper[i + 10].slideNext();
							// swiper[i + 20].slideNext();
						}
					}
					tick++;
					if (tick >= Math.ceil(that.info.mixedGroup.length / 10) * 100)
						tick = 0;

				}, 100)
			} else {}
		},
		initBack: function() {
			$('#back').animate({
				'width': '120%',
				'height': '120%'
			}, 5000)
			setInterval(function() {
				backIndex++;
				if (backIndex > 7)
					backIndex = 1;
				$('#backBack').attr('src', 'img/display/back/back' + backIndex + '-min.jpg')
				setTimeout(function() {
					$('#back').attr('src', 'img/display/back/back' + backIndex + '-min.jpg')
					$('#back').css({
						'width': '100%',
						'height': '100%'
					});
					setTimeout(function() {
						$('#back').animate({
							'width': '120%',
							'height': '120%'
						}, 4000);
					},10);

				}, 500);


			}, 5000)
		}
	},
	mounted: function() {
		var that = this;

		that.getData();
		that.initBack();
		setInterval(function() {
			that.getData();

		}, 30000)
	},
	computed: {
		classOption: function() {
			return {
				step: 1, // 数值越大速度滚动越快
				limitMoveNum: 10, // 开始无缝滚动的数据量 this.dataList.length
				hoverStop: true, // 是否开启鼠标悬停stop
				direction: 1, // 0向下 1向上 2向左 3向右
				openWatch: true, // 开启数据实时监控刷新dom
				singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
				singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
				waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
			}
		}
	}

});

function resetGroup(group) {
	for (let i = 0; i < group.length; i++) {
		group[i].phone = resetPhone(group[i].phone)
	}
	group.sort(function(item1, item2) {
		return item2.calorie - item1.calorie;
	});
}

function resetPhone(phone) {
	var str = String(phone)
	var len = str.length;
	var prev, next;
	if (len >= 8) {
		prev = str.slice(-len, -8)
		next = str.slice(-4)
		str = prev + "****" + next
	} else if (len <= 7 && len >= 6) {
		prev = str.slice(-len, -4)
		next = str.slice(-2)
		str = prev + "**" + next
	}
	return str
}

// function split_array(arr, len) {
// 	var a_len = arr.length;
// 	var result = [];
// 	for (var i = 0; i < a_len; i += len) {
// 		result.push(arr.slice(i, i + len));
// 	}
// 	return result;
// }
function split_array2(arr, len) {
	var a_len = arr.length;
	var index = Math.ceil(a_len / len);
	// len = 10;
	// index = 3;
	var result = [];
	for (var i = 0; i < len; i++) {
		var temp = [];
		for (let j = 0; j < index; j++) {
			var json = arr[i + len * j];
			if (!json)
				json = {
					"phone": "",
					"heartRate": "",
					"calorie": "",
					"time": ""
				}
			temp.push(json);
		}
		result.push(temp);
	}
	return result;
}

function dateFormat(fmt, date) {
	let ret;
	const opt = {
		"y+": date.getFullYear().toString(), // 年
		"M+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"m+": date.getMinutes().toString(), // 分
		"s+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}
