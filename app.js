$(document).ready(function() {
    // Use the older .click() event handler for jQuery 1.2.4 compatibility
    $('#send-btn').click(function() {
        sendMessage();
    });

    // Use the older .keypress() event handler
    $('#user-input').keypress(function(e) {
        if (e.which === 13) {
            sendMessage();
        }
    });

    function sendMessage() {
        var userInput = $('#user-input').val();
        // Use jQuery.trim() for compatibility with older browsers
        if ($.trim(userInput) === '') {
            return;
        }

        appendMessage(userInput, 'user');
        $('#user-input').val('');

        // Simulate AI streaming response.
        // In a real application, you would make an API call to your backend here.
        // The backend would return a stream that you would process.
        simulateAIResponse();
    }

    function appendMessage(text, sender) {
        var messageClass = sender === 'user' ? 'user-message' : 'ai-message';
        var messageElement = $('<div class="message ' + messageClass + '"></div>');
        $('#chat-box').append(messageElement);

        // For jQuery 1.2.4, .scrollTop(value) is not a function.
        // We must access the DOM element directly to set its scrollTop property.
        var chatBox = $('#chat-box')[0];
        chatBox.scrollTop = chatBox.scrollHeight;

        if (sender === 'user') {
            messageElement.text(text);
        }
        return messageElement;
    }

    function simulateAIResponse() {
        var aiMessageElement = appendMessage('', 'ai');
        var fullResponse = "# Hello, Markdown!\n\nHere is a chart:\n[ECHART]{\"title\":{\"text\":\"Sales Data\"},\"tooltip\":{},\"xAxis\":{\"data\":[\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sat\",\"Sun\"]},\"yAxis\":{},\"series\":[{\"name\":\"Sales\",\"type\":\"bar\",\"data\":[120,200,150,80,70,110,130]}]}[/ECHART]\n\nAnd some more text here.";

        var currentIndex = 0;
        var chatBox = $('#chat-box')[0];

        var isInsideChartBlock = false;
        var currentJsonString = '';
        var currentMarkdownString = '';
        var chartIdCounter = 0;
        var currentMarkdownElement = null;

        function createNewMarkdownElement() {
            currentMarkdownElement = $('<div class="markdown-segment"></div>');
            aiMessageElement.append(currentMarkdownElement);
            return currentMarkdownElement;
        }

        createNewMarkdownElement();

        function processStream() {
            if (currentIndex >= fullResponse.length) {
                if (currentMarkdownElement && currentMarkdownString) {
                    currentMarkdownElement.html(marked.parse(currentMarkdownString));
                }
                chatBox.scrollTop = chatBox.scrollHeight;
                return;
            }

            if (fullResponse.substring(currentIndex, currentIndex + 8) === '[ECHART]') {
                if (currentMarkdownString) {
                    currentMarkdownElement.html(marked.parse(currentMarkdownString));
                }
                isInsideChartBlock = true;
                currentIndex += 8;
                currentJsonString = '';
            } else if (fullResponse.substring(currentIndex, currentIndex + 9) === '[/ECHART]') {
                isInsideChartBlock = false;
                currentIndex += 9;

                var chartId = 'echart-instance-' + chartIdCounter++;
                var chartContainer = $('<div id="' + chartId + '" class="echart-container" style="width: 100%; height:300px;"></div>');
                aiMessageElement.append(chartContainer);

                try {
                    var chartOption = JSON.parse(currentJsonString);
                    var chart = echarts.init(document.getElementById(chartId));
                    chart.setOption(chartOption);
                } catch (e) {
                    console.error("Failed to parse or render chart:", e);
                    chartContainer.text("Error rendering chart.");
                }

                currentMarkdownString = '';
                createNewMarkdownElement();
            } else {
                if (isInsideChartBlock) {
                    currentJsonString += fullResponse[currentIndex];
                } else {
                    currentMarkdownString += fullResponse[currentIndex];
                    currentMarkdownElement.html(marked.parse(currentMarkdownString + '█'));
                }
                currentIndex++;
            }

            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(processStream, 25);
        }

        processStream();
    }
});