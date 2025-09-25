$(document).ready(function() {
    $('#send-btn').on('click', function() {
        sendMessage();
    });

    $('#user-input').on('keypress', function(e) {
        if (e.which === 13) {
            sendMessage();
        }
    });

    function sendMessage() {
        const userInput = $('#user-input').val();
        if (userInput.trim() === '') {
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
        const messageClass = sender === 'user' ? 'user-message' : 'ai-message';
        const messageElement = $(`<div class="message ${messageClass}"></div>`);
        $('#chat-box').append(messageElement);
        // Scroll to the bottom
        $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
        if (sender === 'user') {
            messageElement.text(text);
        }
        return messageElement;
    }

    function simulateAIResponse() {
        const aiMessageElement = appendMessage('', 'ai');
        const fullResponse = "This is a simulated streaming response from the AI. Each word appears one by one to demonstrate the streaming effect.";
        const words = fullResponse.split(' ');
        let currentWordIndex = 0;

        function streamWord() {
            if (currentWordIndex < words.length) {
                aiMessageElement.text(aiMessageElement.text() + words[currentWordIndex] + ' ');
                currentWordIndex++;
                // Scroll to the bottom
                $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
                setTimeout(streamWord, 100); // Adjust delay for faster/slower streaming
            }
        }

        streamWord();
    }
});