// AgROI 페이지 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 데모 탭 전환 초기화
    initDemoTabs();
    
    // 차트 초기화
    initMonitoringChart();
    
    // 스크롤 애니메이션
    initScrollAnimations();
});

// 데모 탭 전환
function initDemoTabs() {
    const tabButtons = document.querySelectorAll('.demo-tab-btn');
    const contents = document.querySelectorAll('.demo-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 모든 버튼과 콘텐츠 비활성화
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-green-600', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700');
            });
            contents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // 선택된 버튼과 콘텐츠 활성화
            this.classList.add('active', 'bg-green-600', 'text-white');
            this.classList.remove('bg-white', 'text-gray-700');
            
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
                
                // 모니터링 탭이 활성화되면 차트 업데이트
                if (targetTab === 'monitoring') {
                    updateMonitoringChart();
                }
            }
        });
    });
}

// ROI 계산 함수
function calculateROI() {
    const facilityType = document.getElementById('facility-type').value;
    const area = parseFloat(document.getElementById('area').value);
    const capex = parseFloat(document.getElementById('capex').value);
    const opex = parseFloat(document.getElementById('opex').value);
    const revenue = parseFloat(document.getElementById('revenue').value);
    
    // 연간 순이익
    const annualProfit = revenue - opex;
    
    // ROI 계산 (%)
    const roi = ((annualProfit / capex) * 100).toFixed(1);
    
    // 회수기간 (년)
    const paybackPeriod = (capex / annualProfit).toFixed(1);
    
    // 평당 수익성 (만원/평)
    const perArea = ((annualProfit * 10) / area).toFixed(1);
    
    // 결과 표시
    document.getElementById('roi-result').textContent = roi + '%';
    document.getElementById('payback-result').textContent = paybackPeriod + '년';
    document.getElementById('profit-result').textContent = annualProfit.toFixed(0) + '백만원';
    document.getElementById('per-area-result').textContent = perArea + '만원/평';
    
    // ROI에 따른 색상 변경
    const roiElement = document.getElementById('roi-result');
    if (roi >= 20) {
        roiElement.className = 'text-3xl font-bold text-green-600';
    } else if (roi >= 10) {
        roiElement.className = 'text-3xl font-bold text-blue-600';
    } else if (roi >= 5) {
        roiElement.className = 'text-3xl font-bold text-yellow-600';
    } else {
        roiElement.className = 'text-3xl font-bold text-red-600';
    }
    
    // 애니메이션 효과
    animateResult(roiElement);
    animateResult(document.getElementById('payback-result'));
    animateResult(document.getElementById('profit-result'));
    animateResult(document.getElementById('per-area-result'));
}

// 결과 애니메이션
function animateResult(element) {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transition = 'transform 0.3s ease';
        element.style.transform = 'scale(1)';
    }, 100);
}

// 모니터링 차트 초기화
let monitoringChart = null;

function initMonitoringChart() {
    const ctx = document.getElementById('monitoring-chart');
    if (!ctx) return;
    
    // 24시간 데이터 생성
    const hours = [];
    for (let i = 0; i < 24; i++) {
        hours.push(i + ':00');
    }
    
    // 초기 데이터
    const tempData = generateSineData(24, 22, 26, 24);
    const humidityData = generateSineData(24, 60, 80, 70);
    const co2Data = generateSineData(24, 700, 1000, 850);
    
    monitoringChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [
                {
                    label: '온도 (°C)',
                    data: tempData,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: '습도 (%)',
                    data: humidityData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                },
                {
                    label: 'CO₂ (ppm)',
                    data: co2Data,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '온도 (°C)'
                    },
                    min: 20,
                    max: 28
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '습도 (%)'
                    },
                    min: 50,
                    max: 90,
                    grid: {
                        drawOnChartArea: false
                    }
                },
                y2: {
                    type: 'linear',
                    display: false,
                    min: 600,
                    max: 1100
                }
            }
        }
    });
}

// 차트 업데이트 (실시간 시뮬레이션)
function updateMonitoringChart() {
    if (!monitoringChart) return;
    
    // 새로운 데이터 생성
    const tempData = generateSineData(24, 22, 26, 24);
    const humidityData = generateSineData(24, 60, 80, 70);
    const co2Data = generateSineData(24, 700, 1000, 850);
    
    monitoringChart.data.datasets[0].data = tempData;
    monitoringChart.data.datasets[1].data = humidityData;
    monitoringChart.data.datasets[2].data = co2Data;
    
    monitoringChart.update();
}

// 사인파 데이터 생성 함수
function generateSineData(length, min, max, average) {
    const data = [];
    const amplitude = (max - min) / 2;
    const offset = (max + min) / 2;
    
    for (let i = 0; i < length; i++) {
        const noise = (Math.random() - 0.5) * amplitude * 0.3;
        const value = offset + amplitude * Math.sin((i / length) * Math.PI * 2) + noise;
        data.push(parseFloat(value.toFixed(1)));
    }
    
    return data;
}

// 스크롤 애니메이션
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션을 적용할 요소들
    const animateElements = document.querySelectorAll('.bg-white, .service-card, section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 실시간 모니터링 값 업데이트 (시뮬레이션)
setInterval(function() {
    const monitoringSection = document.getElementById('monitoring');
    if (!monitoringSection || monitoringSection.style.display === 'none') return;
    
    // 온도 업데이트
    const tempValue = (22 + Math.random() * 4).toFixed(1);
    const tempElements = document.querySelectorAll('.bg-red-50 .text-3xl');
    if (tempElements.length > 0) {
        const oldValue = parseFloat(tempElements[0].textContent);
        const newValue = parseFloat(tempValue);
        animateValue(tempElements[0], oldValue, newValue, '°C');
    }
    
    // 습도 업데이트
    const humidityValue = (60 + Math.random() * 20).toFixed(0);
    const humidityElements = document.querySelectorAll('.bg-blue-50 .text-3xl');
    if (humidityElements.length > 0) {
        const oldValue = parseFloat(humidityElements[0].textContent);
        const newValue = parseFloat(humidityValue);
        animateValue(humidityElements[0], oldValue, newValue, '%');
    }
}, 5000);

// 값 애니메이션
function animateValue(element, start, end, suffix) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * progress;
        element.textContent = current.toFixed(1) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 페이지 로드 완료 시
window.addEventListener('load', function() {
    // 초기 애니메이션
    const hero = document.querySelector('section');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
    
    // ROI 계산기 초기 계산
    if (document.getElementById('roi-calculator')) {
        calculateROI();
    }
});

// 콘솔 메시지
console.log('%cAgsmartROI - 스마트농업 ROI 통합 플랫폼', 'color: #16a34a; font-size: 18px; font-weight: bold;');
console.log('%cPowered by 이암허브', 'color: #2563eb; font-size: 12px;');