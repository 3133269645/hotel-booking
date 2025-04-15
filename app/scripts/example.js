document.addEventListener("DOMContentLoaded", function () {
    // 为右上角图片添加点击事件，点击后触发缩小效果
    document.querySelector(".corner-image-right").addEventListener("click", function () {
        this.classList.add("shrink");
    });

    // 为左上角图片添加点击事件，点击后触发缩小效果
    document.querySelector(".corner-image-left").addEventListener("click", function () {
        this.classList.add("shrink");
    });

    // 为登录按钮添加点击事件
    document.getElementById("loginButton").addEventListener("click", async function () {
        // 检查是否安装了 MetaMask
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            try {
                // 请求用户钱包地址
                const accounts = await provider.send("eth_requestAccounts", []);
                const userAddress = accounts[0];

                // 弹出提示框显示连接的地址
                alert("您已经成功连接了您的钱包，可以直接进入");

                // 保存钱包地址到 localStorage
                localStorage.setItem('walletAddress', userAddress);

                // 显示登录成功的小窗口
                const popup = document.getElementById('loginSuccessPopup');
                popup.style.display = 'flex';

                // 设置延时隐藏小窗口并进行后续操作
                setTimeout(() => {
                    // 不隐藏 popup，而是显示输入框
                    const popup = document.getElementById('loginSuccessPopup');
                    popup.style.display = 'flex';

                    const enterButton = document.getElementById('enterButton');
                    enterButton.addEventListener('click', () => {
                        const username = document.getElementById('usernameInput').value.trim();
                        if (!username) {
                            alert("请输入您的姓名");
                            return;
                        }
                        // 保存用户名
                        localStorage.setItem('username', username);

                        // 检查 WebSocket 是否已经连接
                        if (!socket || socket.readyState === WebSocket.CLOSED) {
socket = new WebSocket('ws://localhost:8545/ws');
                        socket.onopen = function () {
                            console.log("WebSocket connection established.");
                            window.location.href = "booking.html";
                        };
                        socket.onerror = function (error) {
                            console.error("WebSocket error:", error);
                            alert("WebSocket connection failed.");
                        };
} else {
                            console.log("WebSocket is already connected.");
                        }
                    });

                    const cancelButton = document.getElementById('cancelButton');
                    cancelButton.addEventListener('click', () => {
                        // 关闭弹窗并清空输入框
                        popup.style.display = 'none';
                        document.getElementById('usernameInput').value = '';
                    });
                }, 1000); // 显示得稍微快一点更自然
                // 延迟3秒后执行

            } catch (error) {
                // 捕获连接钱包时的错误
                console.error("Error connecting to wallet:", error);
                alert("Failed to connect to wallet.");
            }
        } else {
            // 提示用户安装 MetaMask
            alert("MetaMask is not installed. Please install MetaMask.");
        }
    });

    // 检查代码中是否有 `process` 的使用
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('Development mode');
    } else {
        console.log('Production mode');
    }

    if (typeof process !== 'undefined' && process.env.NODE_DEBUG) {
        var debugEnv = process.env.NODE_DEBUG;
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
            .replace(/\*/g, '.*')
            .replace(/,/g, '$|^')
            .toUpperCase();
        debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
    }
});