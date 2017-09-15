Chart.ready(() => {
    const basicX = 150;
    const startY = 20;
    const endY = 350;
    const newX = 50;
    const newY = 50;
    var nodeNum=0;
    let _current = null; // 当前选择节点id

    let _showNodeInfo = (data) => {
        if (!data) {
            return;
        }

        let infoPanel = $('.right');

    infoPanel.find('#nodeid').html(data.nodeId || '');
        infoPanel.find('.proc-name').val(data.name || '');
        //infoPanel.find('.proc-desc').val(data.desc || '');

    };

    let _hideNodeInfo = () => {
        _showNodeInfo({
            name: '',
            desc: ''
        });
    };

    let _createChart = function() {
        return new Chart($('#demo-chart'), {
            onNodeClick (data) { // 点击节点时触发
                _showNodeInfo(data);
                _current = data.nodeId;
                $(".window").each(function () {
                    $(this).removeClass("node-selected");
                });
                $("#"+_current).addClass("node-selected");
            },
            onNodeDel (data) {
                console.log(data);
                _hideNodeInfo();
            }
        })
    };

    let chart = _createChart();

    //添加开始节点
    let nodeStart = chart.addNode('开始', basicX, startY, {
        class: 'node-start',
        removable: false,
        data: {
            name: '开始',
            nodeType: 0
        }
    });
    nodeStart.addPort({
        isSource: true
    });

    //添加结束节点
    let nodeEnd = chart.addNode('结束', basicX, endY, {
        class: 'node-end',
        removable: false,
        data: {
            name: '结束',
            nodeType: 0
        }
    });
    nodeEnd.addPort({
        isTarget: true,
        position: 'Top'
    });

    const addNewTask = (name, params) => {
        params = params || {};
        params.data = params.data || {};
        params.class = 'node-process';
        params.data.nodeType = 1; // 流程节点类型
        let node = chart.addNode(name, newX, newY, params);
        node.addPort({
            isSource: true
        });
        node.addPort({
            isTarget: true,
            position: 'Top'
        });
    };

    const bindEvent = () => {
         $(".flowchart-panel").on('click', '.btn-add', function(event) {
            let target = $(event.target);
            let node = target.data('node');
            addNewTask("node"+nodeNum, {
                data: node
            });
             nodeNum++;
        });

        $(".btn-save").click(() => {
            $('#jsonOutput').val(JSON.stringify(chart.toJson()));
        });

        $(".editBtn").click(() => {
            var newName=$(".proc-name").val();
            //var desc=$(".proc-desc").val();
            $("#"+_current).html(newName+"<div class='remove'></div>");
            chart.updateInfo(_current,newName)
        });

        $(".btn-load").click(() => {
            if ($('#demo-chart').length === 0) {

                $('<div id="demo-chart"></div>').appendTo($('.middle'));
                chart = _createChart();
            }
            chart.fromJson($('#jsonOutput').val());
        });

        $(".btn-clear").click(() => {
            $('#demo-chart').remove();
            chart.clear();
        });

        // $(".btn-del").click(() => {
        //     if (!_current) {
        //         return;
        //     }

        //     chart.removeNode(_current);
        // });
    };

    bindEvent();

    // 使用测试数据
    let listHtml = '';
    TEST_NODES.forEach(node => {
        listHtml += `<li><span class='node-name'>${node.name}</span><a class='btn-add' data-id='node.procId' href='javascript:void(0)'>添加</a></li>`;
    });
    $('.nodes').html(listHtml);
    $('.nodes').find('.btn-add').each(function(index) {
        $(this).data('node', $.extend({}, TEST_NODES[index]));
    });
});
