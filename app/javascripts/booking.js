window.addEventListener('load', function() {
    if (typeof App === "undefined") {
        console.error("App is not defined");
        return;
    }

    console.log("App is defined and ready");


    // 初始化 App 并执行回调
    App.start(function() {
        console.log('App initialized successfully.');

        // 处理配额修改按钮点击事件
        $("#changeQuota").click(function() {
            var newquota = $("#confQuota").val();
            App.changeQuota(newquota);  // 调用 App 的 changeQuota 方法
        });

        // 预定按钮点击事件
        $(".button").click(function() {
            var amount = $(this).data("amount");

            // 显示日期选择框
            $("#datePickerModal").show();

            // 将金额绑定到确认按钮
            $("#confirmDate").data("amount", amount);
        });

        // 取消按钮事件
        $("#cancelDate").click(function() {
            $("#datePickerModal").hide();
        });

        // 确认按钮事件
        $("#confirmDate").click(function() {
            var amount = $(this).data("amount");
            var date = $("#datePicker").val();

            if (date) {
                App.bookReservation(amount, date);  // 调用 App 的预定函数
                alert('您已选择预定！金额: ' + amount + '，日期: ' + date);
                closeDatePicker();
            } else {
                alert('请选择一个日期');
            }
        });

        // 搜索按钮点击事件
        const searchButton = document.getElementById('search');
        if (searchButton) {
            searchButton.addEventListener('click', function () {
                const query = document.getElementById('inpt_search').value.trim();
                if (query) {
                    alert(`搜索功能尚未实现，但您输入了: ${query}`);
                } else {
                    alert('请输入搜索内容');
                }
            });
        } else {
            console.error("Element with ID 'search' not found.");
        }
    });
});

// 关闭日期选择框的函数
function closeDatePicker() {
    $("#datePickerModal").hide();
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('inpt_search');
    if (!searchInput) {
        console.warn('Element with ID "inpt_search" not found.');
        return;
    }

    const searchLabel = searchInput.parentElement;

    searchInput.addEventListener('focus', function () {
        searchLabel.classList.add('active');
    });

    searchInput.addEventListener('blur', function () {
        if (searchInput.value.trim().length === 0) {
            searchLabel.classList.remove('active');
        }
    });
});

