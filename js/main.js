// ==================== CONFIG ====================
// Last.fm
const LASTFM_API_KEY = '53d6f29a8a72790a782fe4b107d6cc8c';
const LASTFM_USERNAME = 'psych0ne';

// Dota 2
const DOTA_ACCOUNT_ID = '1131688919';

// Steam 
const STEAM_API_KEY = '66C0B880A2E6B22EBBF3DA76245FCD48';
const STEAM_ID = '76561197960486383'; // Steam64 ID

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            follower.style.left = e.clientX - 12 + 'px';
            follower.style.top = e.clientY - 12 + 'px';
        }, 50);
    });

    document.querySelectorAll('a, button, .about-card, .contact-card, .game-card, .project-item, .stat-card, .rank-node, .mini-game').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.width = '50px';
            follower.style.height = '50px';
            follower.style.borderColor = 'var(--orange)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.width = '32px';
            follower.style.height = '32px';
            follower.style.borderColor = 'var(--purple)';
        });
    });
}

// ==================== MOBILE MENU ====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
}
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ==================== NAVBAR SCROLL ====================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.style.background = window.pageYOffset > 100 
        ? 'rgba(10, 10, 10, 0.95)' 
        : 'rgba(10, 10, 10, 0.8)';
});

// ==================== GLITCH EFFECT ====================
const glitchElement = document.querySelector('.glitch');
if (glitchElement) {
    const originalText = glitchElement.textContent;
    glitchElement.addEventListener('mouseenter', () => {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let iterations = 0;
        const interval = setInterval(() => {
            glitchElement.textContent = originalText
                .split('')
                .map((char, index) => index < iterations ? originalText[index] : chars[Math.floor(Math.random() * chars.length)])
                .join('');
            if (iterations >= originalText.length) {
                clearInterval(interval);
                glitchElement.textContent = originalText;
            }
            iterations += 1/3;
        }, 30);
    });
}

// ==================== ANIMATED COUNTERS ====================
function initCounters() {
    const counters = document.querySelectorAll('.stat-value[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                const duration = 2000;
                const startTime = performance.now();
                
                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 4);
                    entry.target.textContent = Math.floor(target * ease) + suffix;
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==================== DYNAMIC FAVICON ====================
function initFaviconAnimation() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    let hue = 270;
    
    function draw() {
        ctx.clearRect(0, 0, 32, 32);
        const gradient = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        ctx.beginPath();
        ctx.arc(16, 16, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = canvas.toDataURL('image/png');
        
        hue += 0.5;
        if (hue > 330) hue = 270;
        requestAnimationFrame(draw);
    }
    draw();
}

// ==================== LAST.FM MINI PLAYER ====================
async function initLastFmPlayer() {
    const trackName = document.getElementById('track-name');
    if (!trackName) return;
    
    if (!LASTFM_API_KEY || LASTFM_API_KEY.includes('ВСТАВЬ')) {
        trackName.textContent = 'Last.fm не настроен';
        document.getElementById('track-artist').textContent = 'Добавь API Key в main.js';
        return;
    }
    
    const trackArtist = document.getElementById('track-artist');
    const trackLink = document.getElementById('track-link');
    const vinyl = document.querySelector('.vinyl-spin');
    const indicator = document.querySelector('.playing-indicator');
    
    async function update() {
        try {
            const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.recenttracks?.track?.length > 0) {
                const track = data.recenttracks.track[0];
                const isPlaying = track['@attr']?.nowplaying === 'true';
                
                trackName.textContent = track.name || 'Неизвестно';
                trackArtist.textContent = track.artist?.['#text'] || '—';
                trackLink.href = track.url || '#';
                
                if (vinyl) vinyl.style.animationPlayState = isPlaying ? 'running' : 'paused';
                if (indicator) indicator.style.opacity = isPlaying ? '1' : '0.3';
            }
        } catch (e) { console.log('Last.fm error:', e); }
    }
    
    update();
    setInterval(update, 15000);
}

// ==================== DOTA 2 STATS (OpenDota) ====================
async function initDotaStats() {
    const matchesEl = document.getElementById('dota-matches');
    if (!matchesEl || !DOTA_ACCOUNT_ID) return;
    
    try {
        const [playerRes, wlRes] = await Promise.all([
            fetch(`https://api.opendota.com/api/players/${DOTA_ACCOUNT_ID}`),
            fetch(`https://api.opendota.com/api/players/${DOTA_ACCOUNT_ID}/wl`)
        ]);
        
        const player = await playerRes.json();
        const wl = await wlRes.json();
        
        const matches = (wl.win || 0) + (wl.lose || 0);
        const winrate = matches > 0 ? Math.round((wl.win / matches) * 100) : 0;
        const mmr = player.mmr_estimate?.estimate || player.competitive_rank || '—';
        
        matchesEl.textContent = matches;
        document.getElementById('dota-winrate').textContent = winrate + '%';
        document.getElementById('dota-rank').textContent = mmr;
        document.getElementById('dota-kda').textContent = '—'; // OpenDota totals требует отдельного запроса
        
    } catch (e) { console.log('OpenDota error:', e); }
}

// ==================== STEAM CS STATS ====================
async function initSteamStats() {
    if (!STEAM_API_KEY || STEAM_API_KEY.includes('ВСТАВЬ')) {
        initCounters();
        return;
    }
    
    try {
        const url = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?appid=730&key=${STEAM_API_KEY}&steamid=${STEAM_ID}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.playerstats?.stats) {
            const stats = data.playerstats.stats;
            const get = (name) => stats.find(s => s.name === name)?.value || 0;
            
            const rounds = get('total_rounds_played');
            const hs = get('total_kills_headshot');
            const kills = get('total_kills');
            const wins = get('total_wins');
            
            const hsPercent = kills > 0 ? Math.round((hs / kills) * 100) : 0;
            const winrate = rounds > 0 ? Math.round((wins / rounds) * 100) : 0;
            
            const csStats = document.getElementById('cs-stats');
            if (csStats) {
                const cards = csStats.querySelectorAll('.stat-value');
                if (cards[0]) { cards[0].setAttribute('data-target', rounds); cards[0].textContent = '0'; }
                if (cards[1]) { cards[1].setAttribute('data-target', Math.round(rounds * 1.5)); cards[1].textContent = '0'; }
                if (cards[2]) { cards[2].setAttribute('data-target', hsPercent); cards[2].textContent = '0'; }
                if (cards[3]) { cards[3].setAttribute('data-target', winrate); cards[3].textContent = '0'; }
            }
        }
        initCounters();
    } catch (e) {
        console.log('Steam API error:', e);
        initCounters();
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initFaviconAnimation();
    initLastFmPlayer();
    initDotaStats();
    initSteamStats();
    
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.about-card, .game-card, .project-item, .contact-card, .mini-game, .stat-card, .rank-section, .mini-player').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});
