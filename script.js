document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const generateBtn = document.getElementById('generate-btn');
    const batchGenerateBtn = document.getElementById('batch-generate-btn');
    const phoneNumberInput = document.getElementById('phone-number');
    const messageInput = document.getElementById('message');
    const batchNumbersInput = document.getElementById('batch-numbers');
    const batchMessageInput = document.getElementById('batch-message');
    const resultLink = document.getElementById('result-link');
    const copyBtn = document.getElementById('copy-btn');
    const openBtn = document.getElementById('open-btn');
    const singleResult = document.getElementById('single-result');
    const batchResult = document.getElementById('batch-result');
    const resultTbody = document.getElementById('result-tbody');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');

    // 标签页切换功能
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有标签页和内容的活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // 添加当前标签页和内容的活动状态
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            if (tabId === 'single') {
                document.getElementById('single-mode').classList.add('active');
            } else {
                document.getElementById('batch-mode').classList.add('active');
            }
        });
    });

    // 生成WhatsApp链接函数
    function generateWhatsAppLink(phoneNumber, message = '') {
        // 清理电话号码（移除所有非数字字符）
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        
        // 检查号码是否有效（简单验证：长度大于8位）
        if (cleanNumber.length < 8) {
            return { isValid: false, number: cleanNumber, link: '' };
        }
        
        // 构建WhatsApp链接
        let link = `https://api.whatsapp.com/send?phone=${cleanNumber}`;
        
        // 如果有消息，添加到链接
        if (message.trim() !== '') {
            link += `&text=${encodeURIComponent(message)}`;
        }
        
        return { isValid: true, number: cleanNumber, link };
    }

    // 单号码模式 - 生成链接
    generateBtn.addEventListener('click', () => {
        const phoneNumber = phoneNumberInput.value.trim();
        const message = messageInput.value.trim();
        
        if (!phoneNumber) {
            alert('请输入电话号码');
            return;
        }
        
        const result = generateWhatsAppLink(phoneNumber, message);
        
        if (result.isValid) {
            resultLink.value = result.link;
            singleResult.classList.add('show');
        } else {
            alert('无效的电话号码，请检查后重试');
        }
    });

    // 复制链接功能
    copyBtn.addEventListener('click', () => {
        resultLink.select();
        document.execCommand('copy');
        
        // 显示复制成功提示
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message show';
        successMsg.textContent = '链接已复制到剪贴板！';
        copyBtn.parentNode.appendChild(successMsg);
        
        // 2秒后移除提示
        setTimeout(() => {
            successMsg.remove();
        }, 2000);
    });

    // 打开链接功能
    openBtn.addEventListener('click', () => {
        const link = resultLink.value;
        if (link) {
            window.open(link, '_blank');
        }
    });

    // 批量模式 - 生成链接
    batchGenerateBtn.addEventListener('click', () => {
        const batchNumbers = batchNumbersInput.value.trim();
        const batchMessage = batchMessageInput.value.trim();
        
        if (!batchNumbers) {
            alert('请输入至少一个电话号码');
            return;
        }
        
        // 分割多行输入
        const numberLines = batchNumbers.split('\n').filter(line => line.trim() !== '');
        
        // 清空之前的结果
        resultTbody.innerHTML = '';
        
        // 处理每个号码
        numberLines.forEach((number, index) => {
            const result = generateWhatsAppLink(number.trim(), batchMessage);
            
            // 创建表格行
            const row = document.createElement('tr');
            if (!result.isValid) {
                row.classList.add('invalid-number');
            }
            
            // 添加单元格
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${number.trim()}</td>
                <td>${result.number}</td>
                <td>${result.isValid ? `<a href="${result.link}" target="_blank">${result.link}</a>` : '无效号码'}</td>
                <td>
                    ${result.isValid ? `
                        <button class="btn secondary-btn action-btn copy-link-btn" data-link="${result.link}">复制</button>
                        <button class="btn secondary-btn action-btn open-link-btn" data-link="${result.link}">打开</button>
                    ` : '无法生成'}
                </td>
            `;
            
            resultTbody.appendChild(row);
        });
        
        // 显示批量结果
        batchResult.classList.add('show');
        
        // 为新生成的按钮添加事件监听
        addBatchButtonListeners();
    });

    // 为批量结果中的按钮添加事件监听
    function addBatchButtonListeners() {
        // 复制单个链接
        document.querySelectorAll('.copy-link-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const link = this.getAttribute('data-link');
                navigator.clipboard.writeText(link).then(() => {
                    // 显示复制成功提示
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message show';
                    successMsg.textContent = '链接已复制！';
                    this.parentNode.appendChild(successMsg);
                    
                    // 2秒后移除提示
                    setTimeout(() => {
                        successMsg.remove();
                    }, 2000);
                });
            });
        });
        
        // 打开单个链接
        document.querySelectorAll('.open-link-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const link = this.getAttribute('data-link');
                window.open(link, '_blank');
            });
        });
    }

    // 复制所有有效链接
    copyAllBtn.addEventListener('click', () => {
        const validLinks = [];
        document.querySelectorAll('#result-tbody tr').forEach(row => {
            const linkCell = row.querySelector('td:nth-child(4)');
            const link = linkCell.textContent;
            if (link !== '无效号码') {
                validLinks.push(link);
            }
        });
        
        if (validLinks.length > 0) {
            const allLinks = validLinks.join('\n');
            navigator.clipboard.writeText(allLinks).then(() => {
                alert(`已复制 ${validLinks.length} 个有效链接到剪贴板！`);
            });
        } else {
            alert('没有找到有效的链接可复制');
        }
    });

    // 导出为CSV
    exportCsvBtn.addEventListener('click', () => {
        const rows = [];
        // 添加CSV头部
        rows.push(['序号', '原始号码', '处理后号码', 'WhatsApp链接']);
        
        // 添加数据行
        document.querySelectorAll('#result-tbody tr').forEach(row => {
            const columns = row.querySelectorAll('td');
            const rowData = [
                columns[0].textContent,
                columns[1].textContent,
                columns[2].textContent,
                columns[3].textContent === '无效号码' ? '无效号码' : columns[3].querySelector('a').getAttribute('href')
            ];
            rows.push(rowData);
        });
        
        // 转换为CSV格式
        let csvContent = '';
        rows.forEach(rowArray => {
            const row = rowArray.map(column => {
                // 处理包含逗号、引号或换行符的字段
                if (column.includes(',') || column.includes('"') || column.includes('\n')) {
                    return `"${column.replace(/"/g, '""')}"`;
                }
                return column;
            }).join(',');
            csvContent += row + '\r\n';
        });
        
        // 创建下载链接
        const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'whatsapp_links.csv');
        document.body.appendChild(link);
        
        // 触发下载并移除链接
        link.click();
        document.body.removeChild(link);
    });

    // 打开所有链接
    openAllBtn.addEventListener('click', () => {
        // 收集所有有效链接
        const validLinks = [];
        document.querySelectorAll('#result-tbody tr').forEach(row => {
            if (!row.classList.contains('invalid-number')) {
                const linkElement = row.querySelector('td:nth-child(4) a');
                if (linkElement) {
                    validLinks.push(linkElement.getAttribute('href'));
                }
            }
        });
        
        if (validLinks.length === 0) {
            alert('没有找到有效的链接可打开');
            return;
        }
        
        // 如果链接数量过多，提示用户
        if (validLinks.length > 5) {
            const confirmOpen = confirm(`您将要打开 ${validLinks.length} 个链接，这可能会被浏览器拦截。是否继续？`);
            if (!confirmOpen) {
                return;
            }
        }
        
        // 分批打开链接，避免浏览器拦截
        const batchSize = 3; // 每批打开的链接数量
        const batches = Math.ceil(validLinks.length / batchSize);
        
        let currentBatch = 0;
        const openNextBatch = () => {
            if (currentBatch >= batches) {
                return; // 所有批次已处理完毕
            }
            
            const start = currentBatch * batchSize;
            const end = Math.min(start + batchSize, validLinks.length);
            
            // 打开当前批次的链接
            for (let i = start; i < end; i++) {
                window.open(validLinks[i], '_blank');
            }
            
            currentBatch++;
            
            // 如果还有更多批次，延迟一秒后打开下一批
            if (currentBatch < batches) {
                setTimeout(() => {
                    const confirmNextBatch = confirm(`已打开 ${end} 个链接中的 ${end} 个。是否继续打开下一批？`);
                    if (confirmNextBatch) {
                        openNextBatch();
                    }
                }, 1000);
            }
        };
        
        // 开始打开第一批链接
        openNextBatch();
    });
});