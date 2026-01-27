// Khởi tạo khi trang web đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các biến toàn cục
    let fireworksActive = false;
    let fallingFlowersInterval;
    let isMusicPlaying = false;
    let isCountdownFinished = false;
    
    // DOM Elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const musicText = document.querySelector('.music-text');
    const fireworksCanvas = document.getElementById('fireworks-canvas');
    const fallingFlowersContainer = document.getElementById('falling-flowers');
    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    const countdownMessage = document.getElementById('countdown-message');
    const greetingCards = document.querySelectorAll('.greeting-card');
    const randomizeBtn = document.getElementById('randomize-btn');
    const generateGreetingBtn = document.getElementById('generate-greeting');
    const recipientNameInput = document.getElementById('recipient-name');
    const personalGreeting = document.getElementById('personal-greeting');
    const qrContainer = document.getElementById('qr-container');
    const qrCodeElement = document.getElementById('qr-code');
    
    // Ngày Tết Nguyên Đán 2026 (17/02/2026 00:00:00 GMT+7)
    const tetDate = new Date('February 17, 2026 00:00:00 GMT+0700');
    
    // Mảng lời chúc cho từng danh mục
    const greetings = {
        wealth: [
            "Năm mới chúc bạn tiền vào như nước, tiền ra nhỏ giọt, tài khoản tăng vùn vụt!",
            "Chúc bạn năm Bính Ngọ phát tài phát lộc, buôn may bán đắt, tiền về đầy túi!",
            "Năm mới thăng hoa, tài lộc dồi dào, công việc thịnh vượng, tiền bạc dư dả!",
            "Chúc bạn một năm mới an khang thịnh vượng, vạn sự như ý, phúc lộc tràn đầy!",
            "Năm Bính Ngọ chúc bạn luôn gặp may mắn, làm ăn phát đạt, tiền vào như nước!"
        ],
        family: [
            "Chúc gia đình bạn năm mới hạnh phúc sum vầy, bình an và ấm no!",
            "Năm Bính Ngọ chúc cả nhà sức khỏe dồi dào, hạnh phúc viên mãn, an khang thịnh vượng!",
            "Chúc gia đình bạn năm mới tràn ngập tiếng cười, yêu thương và hạnh phúc!",
            "Năm mới chúc gia đình bạn luôn ấm êm, hòa thuận, mọi điều tốt lành!",
            "Chúc cả nhà một năm mới bình an, mạnh khỏe, hạnh phúc và thành công!"
        ],
        career: [
            "Chúc bạn năm Bính Ngọ thăng tiến như diều gặp gió, công việc hanh thông, thành công rực rỡ!",
            "Năm mới chúc bạn công việc thuận lợi, sự nghiệp thăng hoa, đạt được mọi mục tiêu!",
            "Chúc bạn năm mới đầy ắp cơ hội, thành công vượt bậc trong học tập và công việc!",
            "Năm Bính Ngọ chúc bạn học hành tấn tới, công việc thăng tiến, sự nghiệp rạng ngời!",
            "Chúc bạn một năm mới đầy năng lượng, sáng tạo và thành công trong mọi lĩnh vực!"
        ],
        health: [
            "Năm mới chúc bạn dồi dào sức khỏe, tràn đầy năng lượng, vui tươi mỗi ngày!",
            "Chúc bạn năm Bính Ngọ sức khỏe dẻo dai, tinh thần minh mẫn, sống lâu trăm tuổi!",
            "Năm mới chúc bạn và gia đình luôn khỏe mạnh, an yên và hạnh phúc!",
            "Chúc bạn một năm mới tràn đầy sức sống, tinh thần phấn chấn, cơ thể cường tráng!",
            "Năm Bính Ngọ chúc bạn luôn tươi trẻ, khỏe mạnh và tràn đầy năng lượng tích cực!"
        ]
    };
    
    // Hàm hiển thị loading screen
    function showLoadingScreen() {
        // Animation cho hoa nở
        const petals = document.querySelectorAll('.petal');
        petals.forEach((petal, index) => {
            petal.style.animation = `fadeIn 1s ease ${index * 0.2}s forwards`;
        });
        
        // Ẩn loading screen sau 3 giây
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            mainContent.classList.remove('hidden');
            
            // Khởi tạo các hiệu ứng sau khi loading xong
            initFallingFlowers();
            initParallaxEffect();
            updateCountdown();
            setInterval(updateCountdown, 1000);
            initFireworksCanvas();
            
            // Tạo hiệu ứng cho tiêu đề
            animateTitle();
        }, 3000);
    }
    
    // Hàm tạo hoa rơi
    function initFallingFlowers() {
        // Tạo hoa rơi liên tục
        fallingFlowersInterval = setInterval(createFallingFlower, 500);
        
        // Tạo 10 hoa ban đầu
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createFallingFlower(), i * 200);
        }
    }
    
    // Hàm tạo một bông hoa rơi
    function createFallingFlower() {
        const flower = document.createElement('div');
        flower.className = 'falling-flower';
        
        // Chọn ngẫu nhiên loại hoa (mai hoặc đào)
        const flowerTypes = ['🌸', '🏵️', '🌺', '💮', '🥀'];
        const randomFlower = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flower.textContent = randomFlower;
        
        // Kích thước ngẫu nhiên
        const size = Math.random() * 30 + 20;
        flower.style.fontSize = `${size}px`;
        
        // Vị trí ngang ngẫu nhiên
        const left = Math.random() * 100;
        flower.style.left = `${left}%`;
        
        // Tốc độ rơi ngẫu nhiên
        const duration = Math.random() * 10 + 10;
        flower.style.animationDuration = `${duration}s`;
        
        // Độ trễ ngẫu nhiên
        const delay = Math.random() * 5;
        flower.style.animationDelay = `${delay}s`;
        
        // Thêm vào container
        fallingFlowersContainer.appendChild(flower);
        
        // Xóa hoa sau khi rơi xong
        setTimeout(() => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        }, (duration + delay) * 1000);
    }
    
    // Hàm tạo hiệu ứng parallax cho tiêu đề
    function initParallaxEffect() {
        const title = document.getElementById('main-title');
        
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            
            title.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    
    // Hàm animate tiêu đề
    function animateTitle() {
        const titleText = document.querySelector('.title-text');
        const yearText = document.querySelector('.year-text');
        
        // Hiệu ứng glow cho tiêu đề
        setInterval(() => {
            titleText.classList.toggle('glow-effect');
        }, 2000);
        
        // Hiệu ứng bounce cho năm
        setInterval(() => {
            yearText.classList.add('bounce');
            setTimeout(() => {
                yearText.classList.remove('bounce');
            }, 1000);
        }, 3000);
    }
    
    // Hàm cập nhật countdown
    function updateCountdown() {
        const now = new Date();
        const timeDifference = tetDate - now;
        
        // Kiểm tra nếu đã đến Tết
        if (timeDifference <= 0 && !isCountdownFinished) {
            isCountdownFinished = true;
            countdownMessage.textContent = "🎉 Chúc Mừng Năm Mới Bính Ngọ 2026! 🎉";
            
            // Hiệu ứng pháo hoa khi countdown kết thúc
            triggerFireworks();
            
            // Cập nhật tất cả số về 00
            for (const key in countdownElements) {
                countdownElements[key].textContent = '00';
                countdownElements[key].classList.add('celebrate');
            }
            
            return;
        }
        
        // Tính toán ngày, giờ, phút, giây
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        // Cập nhật DOM với hiệu ứng flip
        updateCountdownElement(countdownElements.days, days);
        updateCountdownElement(countdownElements.hours, hours);
        updateCountdownElement(countdownElements.minutes, minutes);
        updateCountdownElement(countdownElements.seconds, seconds);
    }
    
    // Hàm cập nhật từng phần tử countdown với hiệu ứng
    function updateCountdownElement(element, value) {
        const currentValue = parseInt(element.textContent);
        
        if (currentValue !== value) {
            // Thêm hiệu ứng flip
            element.classList.add('flipping');
            
            // Cập nhật giá trị sau khi bắt đầu hiệu ứng
            setTimeout(() => {
                element.textContent = value.toString().padStart(2, '0');
                element.classList.remove('flipping');
            }, 300);
        }
    }
    
    // Khởi tạo canvas pháo hoa
    function initFireworksCanvas() {
        const ctx = fireworksCanvas.getContext('2d');
        
        // Đặt kích thước canvas bằng với kích thước cửa sổ
        function resizeCanvas() {
            fireworksCanvas.width = window.innerWidth;
            fireworksCanvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Mảng lưu trữ các pháo hoa
        let fireworks = [];
        
        // Lớp Firework
        class Firework {
            constructor(x, y, targetX, targetY) {
                this.x = x;
                this.y = y;
                this.targetX = targetX;
                this.targetY = targetY;
                this.speed = 10;
                this.velocity = {
                    x: (targetX - x) / this.speed,
                    y: (targetY - y) / this.speed
                };
                this.distance = Math.sqrt(
                    Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2)
                );
                this.traveled = 0;
                this.particles = [];
                this.exploded = false;
                this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            }
            
            update() {
                if (!this.exploded) {
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    this.traveled = Math.sqrt(
                        Math.pow(this.x - (this.targetX - this.velocity.x * this.speed), 2) +
                        Math.pow(this.y - (this.targetY - this.velocity.y * this.speed), 2)
                    );
                    
                    if (this.traveled >= this.distance) {
                        this.explode();
                    }
                }
                
                // Cập nhật các hạt
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    this.particles[i].update();
                    if (this.particles[i].alpha <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
            }
            
            explode() {
                this.exploded = true;
                const particleCount = 100;
                
                for (let i = 0; i < particleCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 5 + 2;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    
                    this.particles.push(new Particle(
                        this.x,
                        this.y,
                        velocity.x,
                        velocity.y,
                        this.color
                    ));
                }
            }
            
            draw() {
                if (!this.exploded) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
                
                // Vẽ các hạt
                this.particles.forEach(particle => particle.draw(ctx));
            }
        }
        
        // Lớp Particle
        class Particle {
            constructor(x, y, vx, vy, color) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.01;
                this.color = color;
                this.gravity = 0.05;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.alpha -= this.decay;
            }
            
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Hàm vẽ animation
        function animate() {
            // Xóa canvas với độ trong suốt để tạo hiệu ứng đuôi
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
            
            // Cập nhật và vẽ các pháo hoa
            for (let i = fireworks.length - 1; i >= 0; i--) {
                fireworks[i].update();
                fireworks[i].draw();
                
                // Xóa pháo hoa đã hết hiệu ứng
                if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
                    fireworks.splice(i, 1);
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        // Bắt đầu animation
        animate();
        
        // Lưu hàm tạo pháo hoa để sử dụng bên ngoài
        window.createFirework = function(x, y) {
            fireworks.push(new Firework(
                fireworksCanvas.width / 2,
                fireworksCanvas.height,
                x,
                y
            ));
        };
        
        // Tạo pháo hoa tự động mỗi 3 giây nếu đang active
        setInterval(() => {
            if (fireworksActive) {
                const x = Math.random() * fireworksCanvas.width;
                const y = Math.random() * fireworksCanvas.height * 0.6;
                window.createFirework(x, y);
            }
        }, 3000);
    }
    
    // Hàm kích hoạt pháo hoa
    function triggerFireworks() {
        fireworksActive = true;
        
        // Tạo nhiều pháo hoa cùng lúc
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = Math.random() * fireworksCanvas.width;
                const y = Math.random() * fireworksCanvas.height * 0.6;
                window.createFirework(x, y);
            }, i * 100);
        }
        
        // Tự động tắt pháo hoa sau 10 giây
        setTimeout(() => {
            fireworksActive = false;
        }, 10000);
    }
    
    // Hàm random lời chúc
    function randomizeGreetings() {
        for (const category in greetings) {
            const messages = greetings[category];
            const randomIndex = Math.floor(Math.random() * messages.length);
            const messageElement = document.getElementById(`${category}-message`);
            
            if (messageElement) {
                // Hiệu ứng fade out/in khi thay đổi
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.textContent = messages[randomIndex];
                    messageElement.style.opacity = '1';
                }, 300);
            }
        }
        
        // Hiệu ứng cho nút
        randomizeBtn.classList.add('clicked');
        setTimeout(() => {
            randomizeBtn.classList.remove('clicked');
        }, 300);
    }
    
    // Hàm tạo lời chúc cá nhân
    function generatePersonalGreeting() {
        const name = recipientNameInput.value.trim();
        
        if (!name) {
            personalGreeting.textContent = "Vui lòng nhập tên người nhận để tạo lời chúc cá nhân!";
            personalGreeting.style.color = "#d32f2f";
            return;
        }
        
        // Mẫu lời chúc cá nhân
        const personalTemplates = [
            `Chúc ${name} một năm Bính Ngọ tràn đầy sức khỏe, hạnh phúc và thành công rực rỡ!`,
            `Năm mới 2026, chúc ${name} và gia đình an khang thịnh vượng, vạn sự như ý!`,
            `${name} thân mến! Chúc bạn năm mới gặp nhiều may mắn, tài lộc dồi dào và niềm vui trọn vẹn!`,
            `Gửi đến ${name} những lời chúc tốt đẹp nhất cho năm Bính Ngọ: thành công, hạnh phúc và bình an!`,
            `Chúc ${name} một năm mới tràn ngập tiếng cười, yêu thương và những thành tựu tuyệt vời!`
        ];
        
        const randomTemplate = personalTemplates[Math.floor(Math.random() * personalTemplates.length)];
        
        // Hiệu ứng hiển thị
        personalGreeting.style.opacity = '0';
        setTimeout(() => {
            personalGreeting.textContent = randomTemplate;
            personalGreeting.style.color = "#d32f2f";
            personalGreeting.style.opacity = '1';
            
            // Tạo QR code để chia sẻ
            generateQRCode(name, randomTemplate);
            qrContainer.style.display = 'block';
        }, 300);
    }
    
    // Hàm tạo QR code
    function generateQRCode(name, greeting) {
        // Xóa QR code cũ
        qrCodeElement.innerHTML = '';
        
        // Tạo nội dung QR code
        const qrContent = `Chúc mừng năm mới 2026!\n\nNgười nhận: ${name}\nLời chúc: ${greeting}\n\nTừ: Website Chúc Tết 2026`;
        
        // Tạo QR code
        QRCode.toCanvas(qrContent, { 
            width: 160,
            height: 160,
            color: {
                dark: '#d32f2f',
                light: '#ffffff'
            }
        }, function(err, canvas) {
            if (err) {
                console.error(err);
                qrCodeElement.innerHTML = '<p>Không thể tạo QR code</p>';
                return;
            }
            
            qrCodeElement.appendChild(canvas);
        });
    }
    
    // Xử lý sự kiện click trên card lời chúc
    greetingCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            
            // Hiệu ứng khi lật card
            if (this.classList.contains('flipped')) {
                const category = this.getAttribute('data-category');
                const messageElement = this.querySelector('.card-message');
                
                // Hiệu ứng cho văn bản
                messageElement.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    messageElement.style.transform = 'scale(1)';
                }, 300);
            }
        });
    });
    
    // Xử lý sự kiện click trên nút random lời chúc
    randomizeBtn.addEventListener('click', randomizeGreetings);
    
    // Xử lý sự kiện click trên nút tạo lời chúc cá nhân
    generateGreetingBtn.addEventListener('click', generatePersonalGreeting);
    
    // Xử lý sự kiện nhấn Enter trong input tên
    recipientNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePersonalGreeting();
        }
    });
    
    // Xử lý sự kiện click để tạo pháo hoa
    document.addEventListener('click', function(e) {
        if (fireworksActive) {
            window.createFirework(e.clientX, e.clientY);
        }
    });
    
    // Xử lý sự kiện toggle nhạc
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicText.textContent = 'Bật nhạc';
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Bật nhạc</span>';
        } else {
            bgMusic.play().catch(e => {
                console.log("Autoplay bị chặn, cần tương tác người dùng");
                musicText.textContent = 'Click để bật';
            });
            musicText.textContent = 'Tắt nhạc';
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i><span class="music-text">Tắt nhạc</span>';
        }
        
        isMusicPlaying = !isMusicPlaying;
        this.classList.toggle('active');
    });
    
    // Cho phép autoplay nhạc sau khi người dùng tương tác
    document.addEventListener('click', function enableAutoplay() {
        if (!bgMusic.played.length) {
            bgMusic.play().then(() => {
                bgMusic.pause();
                bgMusic.currentTime = 0;
            }).catch(e => {
                // Autoplay bị chặn, cần người dùng bật thủ công
            });
        }
        
        // Xóa event listener sau khi đã kích hoạt
        document.removeEventListener('click', enableAutoplay);
    }, { once: true });
    
    // Khởi động loading screen
    showLoadingScreen();
    
    // Thêm CSS cho các hiệu ứng động bổ sung
    const style = document.createElement('style');
    style.textContent = `
        .glow-effect {
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        .bounce {
            animation: bounce 0.8s ease;
        }
        
        .flipping {
            animation: flipNumber 0.6s ease;
        }
        
        .celebrate {
            animation: pulse 1s infinite;
        }
        
        .clicked {
            transform: scale(0.95);
        }
        
        .card-message {
            transition: transform 0.3s ease;
        }
        
        @keyframes flipNumber {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(90deg); }
            100% { transform: rotateX(0deg); }
        }
    `;
    document.head.appendChild(style);
});
