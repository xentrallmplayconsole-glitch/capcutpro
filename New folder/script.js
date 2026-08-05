document.addEventListener('DOMContentLoaded', () => {
    // State
    let adsWatched = 0;
    const TOTAL_ADS = 5;

    // Elements
    const homeView = document.getElementById('home-view');
    const downloadView = document.getElementById('download-view');
    const btnGotoDownload = document.getElementById('btn-goto-download');
    const btnBackHome = document.getElementById('btn-back-home');

    const btnWatchAd = document.getElementById('btn-watch-ad');
    const btnWatchText = document.getElementById('btn-watch-text');
    const btnDownloadNow = document.getElementById('btn-download-now');
    const adsCounter = document.getElementById('ads-counter');
    const progressCircle = document.getElementById('progress-circle');
    const lockIcon = document.getElementById('lock-icon');
    const btnDlSubtitle = document.getElementById('btn-dl-subtitle');

    // 1. Navigation / View Switching
    if (btnGotoDownload) {
        btnGotoDownload.addEventListener('click', () => {
            if (homeView && downloadView) {
                homeView.classList.remove('active');
                downloadView.classList.add('active');
            }
        });
    }

    if (btnBackHome) {
        btnBackHome.addEventListener('click', () => {
            if (homeView && downloadView) {
                downloadView.classList.remove('active');
                homeView.classList.add('active');
            }
        });
    }

    // 2. Watch Ad System (Progress ring calculation: C = 2 * PI * 26 ≈ 163.36)
    const CIRCUMFERENCE = 163.36;

    function updateProgressRing(count) {
        const offset = CIRCUMFERENCE - (count / TOTAL_ADS) * CIRCUMFERENCE;
        if (progressCircle) {
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    if (btnWatchAd) {
        btnWatchAd.addEventListener('click', () => {
            if (adsWatched < TOTAL_ADS) {
                adsWatched++;

                // Update Counter Number
                if (adsCounter) {
                    adsCounter.innerHTML = `${adsWatched} <span class="counter-total">/ ${TOTAL_ADS}</span>`;
                }

                // Update Circular SVG Progress Ring
                updateProgressRing(adsWatched);

                // Update Individual Ad Card State
                const adCard = document.querySelector(`.ad-card[data-ad-index="${adsWatched}"]`);
                if (adCard) {
                    adCard.classList.add('completed');
                    const statusSpan = adCard.querySelector('.ad-status');
                    if (statusSpan) {
                        statusSpan.textContent = 'Completed ✓';
                    }
                    const iconBox = adCard.querySelector('.ad-icon');
                    if (iconBox) {
                        iconBox.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    }
                }

                // Unlock Download when all 5 ads are watched
                if (adsWatched === TOTAL_ADS) {
                    unlockDownload();
                }
            }
        });
    }

    // 3. Unlock Download Button Logic
    function unlockDownload() {
        if (!btnDownloadNow) return;

        btnDownloadNow.classList.remove('locked');
        btnDownloadNow.classList.add('unlocked');
        btnDownloadNow.removeAttribute('disabled');

        if (lockIcon) {
            lockIcon.innerHTML = `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#ffffff" stroke-width="2.5"></path><polyline points="22 4 12 14.01 9 11.01" stroke="#ffffff" stroke-width="2.5"></polyline>`;
        }

        if (btnDlSubtitle) {
            btnDlSubtitle.textContent = 'Download unlocked! Click to start instant download';
        }

        if (btnWatchText) {
            btnWatchText.textContent = 'All Ads Completed!';
        }
    }

    // 4. Download File Execution (CapeCut_Pro.apk)
    if (btnDownloadNow) {
        btnDownloadNow.addEventListener('click', () => {
            if (adsWatched < TOTAL_ADS) return;

            const apkBlob = new Blob(['CapeCut Pro APK package content'], { type: 'application/vnd.android.package-archive' });
            const downloadUrl = URL.createObjectURL(apkBlob);

            const tempAnchor = document.createElement('a');
            tempAnchor.href = downloadUrl;
            tempAnchor.download = 'CapeCut_Pro.apk';
            document.body.appendChild(tempAnchor);
            tempAnchor.click();
            document.body.removeChild(tempAnchor);
            URL.revokeObjectURL(downloadUrl);
        });
    }

    // 5. Interactive Mouse Parallax & 3D Phone Motion
    const heroRight = document.querySelector('.hero-right');
    const phoneWrapper = document.querySelector('.phone-wrapper');

    if (heroRight && phoneWrapper) {
        heroRight.addEventListener('mousemove', (e) => {
            const rect = heroRight.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            phoneWrapper.style.transform = `rotate(-10deg) rotateY(${x * 25}deg) rotateX(${-y * 25}deg)`;
        });

        heroRight.addEventListener('mouseleave', () => {
            phoneWrapper.style.transform = `rotate(-10deg) rotateY(10deg) rotateX(0deg)`;
        });
    }
});
