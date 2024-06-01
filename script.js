document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('send-btn');

    const sendMessage = () => {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            messageInput.value = '';
            scrollToBottom();
        }
    };

    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            sendMessage();
        }
    });

    fetch('messages.json')
        .then(response => response.json())
        .then(data => {
            showConversation(data.conversation);
        })
        .catch(error => console.error('Error loading messages:', error));

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        if (message.startsWith('./img/')) {
            const imagePath = message; // Mengambil path gambar dari pesan
            const imageElement = document.createElement('img');
            imageElement.src = imagePath;
            imageElement.classList.add('image-message');
            imageElement.addEventListener('click', () => openModal(imagePath));
            messageElement.appendChild(imageElement);
        } else {
            messageElement.textContent = message;
        }

        chatWindow.appendChild(messageElement);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatWindow.appendChild(typingIndicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return typingIndicator;
    }

    function removeTypingIndicator(indicator) {
        chatWindow.removeChild(indicator);
    }

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }    

    function showConversation(conversation) {
        let index = 0;
        function showNextMessage() {
            if (index < conversation.length) {
                const item = conversation[index];
                const typingIndicator = showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator(typingIndicator);
                    addMessage(item.message, item.sender);
                    index++;
                    showNextMessage();
                }, 500); // Delay for 0.5 seconds
            }
        }
        showNextMessage();
    }

    // Fungsi untuk membuka modal
    function openModal(imagePath) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const span = document.getElementsByClassName('close')[0];

        modal.style.display = 'block';
        modalImg.src = imagePath;

        // Tutup modal saat pengguna mengklik (x)
        span.onclick = function() {
            modal.style.display = 'none';
        };

        // Tutup modal saat pengguna mengklik di luar gambar
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
});
