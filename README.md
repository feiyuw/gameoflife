# 生命游戏及其变形

## Python版本

* python3 gol.py （保证8080端口可用）
* 打开浏览器（推荐Firefox，别的没有测试过），输入地址：http://localhost:8080/30,50 即可，这里的30和50是行列数
* 注意：当前版本为了实现简单，每次都是把所有数据重写pre标记，行列数大的时候会有性能问题

## D3JS版本

* [Online Demo](//blog.zhangyu.so/gameoflife/index.d3.html)
* 在项目目录下执行http-server (nodejs)或python3 -m http.server 8080 (python)启动一个web服务器
* 打开浏览器，输入地址：http://localhost:8080/index.d3.html
* 点击Play
* 可以修改行列数和刷新间隔
* 注意：当数据较大时会占用较大CPU

## ReactJS版本

* [Online Demo](//blog.zhangyu.so/gameoflife/index.react.html)
* 在GameOfLife的主逻辑上直接用了D3版本的代码
* 显示层用了土土的div
* 主要展示了ReactJS基于state进行render的特点
* 执行的时候通过http-server或者python -m http.server 8080启动web服务器
* 在浏览器里输入地址：http://localhost:8080/index.react.html
* 设置行列数和刷新间隔，点击Play

## GoLang终端版本

* go build -o gol gol.go
* ./gol 40 80  # 默认为30行，60列

效果如下：

<script id="asciicast-8yhK5o7mOKfJh0qXeer65kebM" src="https://asciinema.org/a/8yhK5o7mOKfJh0qXeer65kebM.js" async></script>

## Reference
* [生命游戏](https://zh.wikipedia.org/zh-hans/%E5%BA%B7%E5%A8%81%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F)
* [Build your own Command Line with ANSI escape codes](http://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html)
