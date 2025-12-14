// 컬러풀한 카드 색상 조합
const cardColorCombos = [
    { color1: '#8B5CF6', color2: '#EC4899' }, // 보라-핑크
    { color1: '#3B82F6', color2: '#06B6D4' }, // 블루-시안
    { color1: '#10B981', color2: '#F59E0B' }, // 그린-옐로우
    { color1: '#F97316', color2: '#EF4444' }, // 오렌지-레드
    { color1: '#EC4899', color2: '#8B5CF6' }, // 핑크-보라
    { color1: '#06B6D4', color2: '#3B82F6' }, // 시안-블루
    { color1: '#F59E0B', color2: '#10B981' }, // 옐로우-그린
    { color1: '#EF4444', color2: '#F97316' }  // 레드-오렌지
];

// 사용 가능한 모든 이모지 풀
const emojiPool = [
    '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺',
    '🎤', '🎧', '🎬', '🎥', '📷', '📹', '🎞️', '🎟️',
    '🎫', '🎟️', '🎪', '🎭', '🎨', '🖼️', '🎨', '🖌️',
    '🖍️', '✏️', '✒️', '🖊️', '🖋️', '📝', '💼', '📁',
    '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈',
    '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏',
    '📐', '✂️', '🗑️', '🔒', '🔓', '🔑', '🔐', '🔑',
    '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '💵', '💴',
    '💶', '💷', '💰', '💳', '💎', '⚖️', '🛒', '🛍️',
    '🎁', '🎈', '🎉', '🎊', '🎀', '🎁', '🏆', '🥇',
    '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐',
    '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏',
    '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '⛸️', '🥌',
    '🛷', '🎿', '⛷️', '🏂', '🏋️', '🤼', '🤸', '🤺',
    '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽',
    '🚣', '🧗', '🚵', '🚴', '🏇', '🤹', '🛴', '🛹',
    '🛷', '⛷️', '🏂', '🏋️', '🤼', '🤸', '🤺', '⛹️'
];

// 게임 상태
const gameState = {
    cards: [],
    flippedCards: [],
    moves: 0,
    timer: 0,
    timerInterval: null,
    isLocked: false,
    matchedPairs: 0,
    playerName: '',
    symbols: [] // 게임 시작 시 랜덤으로 선택됨
};

// 랜덤 심볼 선택 함수
function selectRandomSymbols() {
    // 이모지 풀에서 중복 없이 8개 랜덤 선택
    const shuffled = [...emojiPool].sort(() => Math.random() - 0.5);
    gameState.symbols = shuffled.slice(0, 8);
    console.log('선택된 심볼:', gameState.symbols);
}

// 카드 생성
function createCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    gameState.cards = [];
    gameState.matchedPairs = 0;
    
    // 랜덤 심볼 선택
    selectRandomSymbols();
    
    // 심볼 쌍 생성 (8개 심볼 x 2 = 16장)
    const pairs = [...gameState.symbols, ...gameState.symbols];
    
    // Fisher-Yates 셔플 알고리즘
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    
    // 카드 생성
    pairs.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        
        // 심볼 인덱스에 따라 색상 조합 결정
        const symbolIndex = gameState.symbols.indexOf(symbol);
        const colors = cardColorCombos[symbolIndex % cardColorCombos.length];
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = '?';
        cardFront.style.setProperty('--card-color-1', colors.color1);
        cardFront.style.setProperty('--card-color-2', colors.color2);
        cardFront.style.background = `linear-gradient(135deg, ${colors.color1} 0%, ${colors.color2} 100%)`;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = symbol;
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        card.addEventListener('click', () => handleCardClick(card));
        
        gameBoard.appendChild(card);
        gameState.cards.push({
            element: card,
            symbol: symbol,
            isFlipped: false,
            isMatched: false,
            colors: colors
        });
    });
}

// 카드 클릭 처리
function handleCardClick(cardElement) {
    if (gameState.isLocked) return;
    
    const index = parseInt(cardElement.dataset.index);
    const card = gameState.cards[index];
    
    if (card.isFlipped || card.isMatched) return;
    
    // 카드 뒤집기
    flipCard(card);
    
    // 이동 횟수 증가
    gameState.moves++;
    document.getElementById('moves').textContent = gameState.moves;
    
    // 뒤집힌 카드 배열에 추가
    gameState.flippedCards.push(card);
    
    // 2장이 뒤집혔으면 매칭 확인
    if (gameState.flippedCards.length === 2) {
        checkMatch();
    }
}

// 파티클 효과 생성
function createParticles(cardElement) {
    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const particleCount = 12;
    const colors = ['#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F97316'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 60 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// 카드 뒤집기
function flipCard(card) {
    card.isFlipped = true;
    const cardElement = card.element;
    
    // 기존 transform 초기화 (rotateY(0deg)로 명시적 설정)
    cardElement.style.transform = 'rotateY(0deg)';
    
    // 뒤집기 애니메이션 클래스 추가
    cardElement.classList.add('flipping');
    
    // 애니메이션 완료 후 flipped 클래스 추가 (빠르게)
    setTimeout(() => {
        cardElement.classList.remove('flipping');
        cardElement.classList.add('flipped');
        // transform 명시적으로 설정 (인라인 스타일 제거하여 CSS가 적용되도록)
        cardElement.style.transform = '';
    }, 100);
}

// 카드 되돌리기
function unflipCard(card) {
    card.isFlipped = false;
    const cardElement = card.element;
    
    // 모든 클래스 제거
    cardElement.classList.remove('flipped', 'flipping');
    
    // transform 명시적으로 초기화 (인라인 스타일 제거)
    cardElement.style.transform = '';
}

// 팡파레 효과음 생성
function playConfettiSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.3;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        // 여러 주파수를 조합하여 폭발음 효과 생성
        const frequencies = [200, 300, 400, 500, 600, 800];
        
        for (let i = 0; i < frameCount; i++) {
            let sample = 0;
            const t = i / sampleRate;
            
            // 각 주파수의 사인파를 조합
            frequencies.forEach((freq, index) => {
                const amplitude = Math.exp(-t * 10) * (1 - index * 0.1); // 감쇠 효과
                sample += Math.sin(2 * Math.PI * freq * t) * amplitude;
            });
            
            // 노이즈 추가
            sample += (Math.random() - 0.5) * 0.3 * Math.exp(-t * 15);
            
            // 정규화
            channelData[i] = sample * 0.3;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        // 게인 노드로 볼륨 조절
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    } catch (error) {
        console.warn('오디오 재생 실패:', error);
    }
}

// 팡파레 효과 생성
function createConfetti(cardElement) {
    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#a8e6cf', '#ffd93d', '#6c5ce7', '#ff9ff3', '#54a0ff'];
    
    // 효과음 재생
    playConfettiSound();
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 50 + Math.random() * 100;
        const startX = centerX;
        const startY = centerY;
        
        const randomAngle = (Math.random() - 0.5) * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        const endX = startX + Math.cos(randomAngle) * distance;
        const endY = startY + Math.sin(randomAngle) * distance;
        
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (8 + Math.random() * 8) + 'px';
        confetti.style.height = (8 + Math.random() * 8) + 'px';
        
        // 애니메이션 적용
        const animation = confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(720deg) scale(0)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        document.body.appendChild(confetti);
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// 매칭 성공 효과음
function playMatchSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.2;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        // 성공음: 상승하는 톤
        const frequencies = [400, 600, 800];
        
        for (let i = 0; i < frameCount; i++) {
            let sample = 0;
            const t = i / sampleRate;
            
            frequencies.forEach((freq, index) => {
                const amplitude = Math.exp(-t * 8) * (1 - index * 0.2);
                sample += Math.sin(2 * Math.PI * freq * t * (1 + t * 2)) * amplitude;
            });
            
            channelData[i] = sample * 0.4;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    } catch (error) {
        console.warn('효과음 재생 실패:', error);
    }
}

// 매칭 실패 효과음
function playMismatchSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.15;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        // 실패음: 하강하는 톤
        const frequencies = [300, 250, 200];
        
        for (let i = 0; i < frameCount; i++) {
            let sample = 0;
            const t = i / sampleRate;
            
            frequencies.forEach((freq, index) => {
                const amplitude = Math.exp(-t * 10) * (1 - index * 0.2);
                sample += Math.sin(2 * Math.PI * freq * t * (1 - t * 1.5)) * amplitude;
            });
            
            channelData[i] = sample * 0.3;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    } catch (error) {
        console.warn('효과음 재생 실패:', error);
    }
}

// 매칭 확인
function checkMatch() {
    gameState.isLocked = true;
    
    const [card1, card2] = gameState.flippedCards;
    
    // 500ms 딜레이 후 확인
    setTimeout(() => {
        if (card1.symbol === card2.symbol) {
            // 매칭 성공 효과음
            playMatchSound();
            
            // 매칭 성공
            card1.isMatched = true;
            card2.isMatched = true;
            
            // flipping 클래스 제거 (애니메이션 중단)
            card1.element.classList.remove('flipping');
            card2.element.classList.remove('flipping');
            
            // matched 클래스 추가
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            // transform을 명확하게 설정하여 레이아웃 안정화
            card1.element.style.transform = 'rotateY(180deg)';
            card2.element.style.transform = 'rotateY(180deg)';
            
            gameState.matchedPairs++;
            gameState.flippedCards = [];
            gameState.isLocked = false;
            
            // 게임 완료 확인
            if (gameState.matchedPairs === gameState.symbols.length) {
                gameWin();
            }
        } else {
            // 매칭 실패 효과음
            playMismatchSound();
            
            // 매칭 실패 - 카드 되돌리기
            // flipping 클래스 제거
            card1.element.classList.remove('flipping');
            card2.element.classList.remove('flipping');
            
            // 되돌리기 애니메이션 (빠르게)
            card1.element.style.transition = 'transform 0.1s linear';
            card2.element.style.transition = 'transform 0.1s linear';
            
            unflipCard(card1);
            unflipCard(card2);
            
            gameState.flippedCards = [];
            gameState.isLocked = false;
            
            // transition 초기화
            setTimeout(() => {
                card1.element.style.transition = '';
                card2.element.style.transition = '';
            }, 100);
        }
    }, 500);
}

// 게임 승리
function gameWin() {
    stopTimer();
    document.getElementById('win-message').classList.remove('hidden');
    // 자동으로 모달 표시하지 않음 - 버튼으로 선택 가능
}

// 타이머 시작
function startTimer() {
    gameState.timer = 0;
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        document.getElementById('timer').textContent = gameState.timer;
    }, 1000);
}

// 타이머 중지
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// 게임 리셋
function resetGame() {
    stopTimer();
    gameState.flippedCards = [];
    gameState.moves = 0;
    gameState.timer = 0;
    gameState.isLocked = false;
    gameState.matchedPairs = 0;
    
    document.getElementById('moves').textContent = '0';
    document.getElementById('timer').textContent = '0';
    document.getElementById('win-message').classList.add('hidden');
    document.getElementById('leaderboard').classList.add('hidden');
    
    createCards();
    startTimer();
}

// 이름 입력 모달 표시
function showNameModal() {
    const modal = document.getElementById('name-modal');
    const nameInput = document.getElementById('player-name-input');
    
    if (modal && nameInput) {
        modal.classList.remove('hidden');
        nameInput.value = '';
        nameInput.focus();
    }
}

// 점수 저장 (모달에서 호출)
async function saveScoreFromModal() {
    const nameInput = document.getElementById('player-name-input');
    if (!nameInput) {
        console.error('이름 입력 필드를 찾을 수 없습니다.');
        return;
    }
    
    const playerName = nameInput.value.trim();
    
    if (!playerName) {
        alert('이름을 입력해주세요!');
        nameInput.focus();
        return;
    }
    
    // 이름 저장 및 표시
    gameState.playerName = playerName;
    const nameDisplay = document.getElementById('player-name-display');
    if (nameDisplay) {
        nameDisplay.textContent = playerName;
    }
    
    // 모달 숨기기
    const modal = document.getElementById('name-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // 점수 저장
    await saveScore();
    
    // 점수 저장 후 자동으로 리더보드 표시
    await showLeaderboard();
}

// 점수 저장
async function saveScore() {
    // 점수 계산 (낮을수록 좋음: moves * 10 + time_taken)
    const score = gameState.moves * 10 + gameState.timer;
    
    // Supabase 클라이언트 확인
    if (typeof supabase === 'undefined') {
        console.error('Supabase 라이브러리가 로드되지 않았습니다.');
        return;
    }
    
    if (typeof supabaseClient === 'undefined') {
        console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('card_flip_scores')
            .insert([
                {
                    player_name: gameState.playerName,
                    moves: gameState.moves,
                    time_taken: gameState.timer,
                    score: score
                }
            ])
            .select();
        
        if (error) {
            console.error('점수 저장 실패:', error);
            console.error('에러 상세:', JSON.stringify(error, null, 2));
        } else {
            console.log('점수 저장 성공:', data);
        }
    } catch (err) {
        console.error('점수 저장 중 오류:', err);
    }
}

// 리더보드 조회
async function loadTopScores(limit = 10) {
    // Supabase 클라이언트 확인
    if (typeof supabase === 'undefined') {
        console.error('Supabase 라이브러리가 로드되지 않았습니다.');
        return null;
    }
    
    if (typeof supabaseClient === 'undefined') {
        console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
        return null;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('card_flip_scores')
            .select('*')
            .order('score', { ascending: true })
            .order('time_taken', { ascending: true })
            .order('moves', { ascending: true })
            .limit(limit);
        
        if (error) {
            console.error('점수 조회 실패:', error);
            console.error('에러 상세:', JSON.stringify(error, null, 2));
            return null;
        }
        
        return data;
    } catch (err) {
        console.error('점수 조회 중 오류:', err);
        return null;
    }
}

// 리더보드 표시
async function showLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.classList.remove('hidden');
    leaderboardDiv.innerHTML = '<h3>리더보드 로딩 중...</h3>';
    
    const scores = await loadTopScores(10);
    
    if (scores && scores.length > 0) {
        let html = '<h3>🏆 상위 10명</h3><table><tr><th>순위</th><th>이름</th><th>이동</th><th>시간</th><th>점수</th></tr>';
        scores.forEach((score, index) => {
            // 현재 플레이어 강조 표시
            const isCurrentPlayer = score.player_name === gameState.playerName && 
                                   score.moves === gameState.moves && 
                                   score.time_taken === gameState.timer;
            const rowClass = isCurrentPlayer ? 'class="current-player"' : '';
            html += `<tr ${rowClass}>
                <td>${index + 1}</td>
                <td>${score.player_name}</td>
                <td>${score.moves}</td>
                <td>${score.time_taken}초</td>
                <td>${score.score}</td>
            </tr>`;
        });
        html += '</table>';
        leaderboardDiv.innerHTML = html;
    } else {
        leaderboardDiv.innerHTML = '<h3>리더보드</h3><p>아직 기록된 점수가 없습니다.</p>';
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료, 이벤트 리스너 설정 중...');
    
    // 점수 저장 버튼 (모달)
    const saveBtn = document.getElementById('save-score-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            console.log('점수 저장 버튼 클릭');
            saveScoreFromModal();
        });
    } else {
        console.error('점수 저장 버튼을 찾을 수 없습니다.');
    }
    
    // 점수 저장 버튼 (승리 메시지)
    const saveBtnWin = document.getElementById('save-score-btn-win');
    if (saveBtnWin) {
        saveBtnWin.addEventListener('click', () => {
            console.log('승리 메시지 점수 저장 버튼 클릭');
            showNameModal();
        });
    }
    
    // 이름 입력 필드에서 Enter 키로 점수 저장
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter 키 입력');
                saveScoreFromModal();
            }
        });
    } else {
        console.error('이름 입력 필드를 찾을 수 없습니다.');
    }
    
    // 새 게임 버튼
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    // 리더보드 버튼
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', showLeaderboard);
    }
    
    // 게임 바로 시작 (모달 없이)
    createCards();
    startTimer();
});
