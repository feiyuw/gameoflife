# 生命游戏及其变形

## 生命游戏Python版本

* python gol.py （保证8080端口可用）
* 打开浏览器（推荐Firefox，别的没有测试过），输入地址：http://localhost:8080/30,50 即可，这里的30和50是行列数
* 注意：当前版本为了实现简单，每次都是把所有数据重写pre标记，行列数大的时候会有性能问题

## 生命游戏Javascript browser版本

* 在项目目录下执行http-server (nodejs)或python -m simpleHTTPServer 8080 (python)启动一个web服务器
* 打开浏览器，输入地址：http://localhost:8080/index.d3.html
* 点击Play
* 可以修改行列数和刷新间隔
* 注意：当数据较大时会占用较大CPU和内存

