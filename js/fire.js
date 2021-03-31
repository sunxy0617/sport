        let canvas_el = document.getElementById("fireGraphic");
        let ctx = canvas_el.getContext("2d");
        canvas_el.width =2000; canvas_el.height = 300;
        function rand (min, max){
            return Math.floor((Math.random() * (max - min + 1)) + min);
        };
        //火焰粒子对象效果
        function fireBall(position) {
            this.rest(position);
        };
        // 帧数动画对象
        window.requestAnimFrame = function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
                    window.setTimeout(a, 1000)
                }
        }();
        //初始/重置粒子状态
        fireBall.prototype.rest = function (position) {
            this._radius = rand(5, 30);//随机产生初始粒子半径
			var x=rand(0,2000);
            this._position = position || {x: x, y: 300};//初始位置
            this._lineWidth = 1;//粒子边界线宽
            //rgba(255,'+rand(0,165)+','+rand(0,100)+',0.3)
            this._color = 'rgba(255,5,0,0.3)';//粒子颜色
        }
        //渲染
        fireBall.prototype.render=function(){
                ctx.beginPath();
                ctx.arc(this._position.x, this._position.y, this._radius, 0, Math.PI * 2, false);
                ctx.fillStyle = ctx.strokeStyle = this._color;
                ctx.lineWidth = this._lineWidth;
                ctx.fill();
                ctx.stroke();
        }
        // 更新粒子状态
        fireBall.prototype.update = function () {
            if(this._radius>0&&this._position.y >this._radius){
                this._position.x -= rand(-2,2);
                this._position.y -= rand(2,3);
                this._radius -= 0.5;
            }else{
                this.rest();//
            }
        }
        //用多个粒子模拟火球视觉效果，粒子数量自定
        let fires = [];
        for(var i=0; i< 500; i++){
            fires.push(new fireBall())
        }
        let loop = function(){
            //循环调用
            requestAnimFrame(loop, canvas_el)
            //覆盖上一帧图像
            ctx.globalCompositeOperation="destination-out";
            ctx.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
            ctx.fillRect(0,0,2000,300);
            ctx.globalCompositeOperation = 'lighter';
            //绘制本帧的图像，更新状态为下一帧做准备
            fires.forEach(fire=>{
                fire.render();
                fire.update();
            })
        }
        loop();