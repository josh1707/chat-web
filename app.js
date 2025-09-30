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
        // Scroll to the bottom
        $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
        if (sender === 'user') {
            messageElement.text(text);
        }
        return messageElement;
    }

    function simulateAIResponse() {
        var aiMessageElement = appendMessage('', 'ai');
        var fullResponse = "# Hello, Markdown!\n\nHere is a list of features:\n- **Bold text**\n- *Italic text*\n- A code block:\n\n```javascript\nconsole.log(\"Hello, world!\");\n```\n\nThis is rendered in real-time.";

        var accumulatedText = '';
        var characters = fullResponse.split('');
        var currentIndex = 0;

        function streamCharacter() {
            if (currentIndex < characters.length) {
                accumulatedText += characters[currentIndex];
                // Use marked.parse() to convert markdown to HTML and render it.
                // Adding a simple cursor effect for better UX.
                aiMessageElement.html(marked.parse(accumulatedText + '█'));
                currentIndex++;
                $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
                setTimeout(streamCharacter, 25); // Adjust delay for stream speed
            } else {
                // When streaming is complete, render the final HTML without the cursor.
                aiMessageElement.html(marked.parse(accumulatedText));
                $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
            }
        }

        streamCharacter();
    }
});