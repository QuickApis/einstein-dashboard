const walletDisplay = document.getElementById('walletDisplay');
const syncButton = document.getElementById('syncWallet');
const walletStatus = document.getElementById('walletStatus');
const summaryGrid = document.getElementById('summaryGrid');
const historicGrid = document.getElementById('historicGrid');
const summaryChart = document.getElementById('summaryChart');
const historicChart = document.getElementById('historicChart');
const pnlLineChart = document.getElementById('pnlLineChart');
const pnlBarChart = document.getElementById('pnlBarChart');

let currentWallet = null;
let lastHistoric = {};

function formatUsd(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '--';
  return `$${Number(value).toFixed(2)}`;
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '--';
  return `${Number(value).toFixed(2)}%`;
}

function animateValue(node, valueText) {
  if (!node) return;
  node.classList.add('animate');
  node.textContent = valueText;
  setTimeout(() => node.classList.remove('animate'), 400);
}


function setSummaryValue(key, value, formatter = formatUsd) {
  if (!summaryGrid) return;
  const node = summaryGrid.querySelector(`[data-key="${key}"]`);
  if (!node) return;
  const formatted = formatter(value);
  animateValue(node, formatted);
  node.classList.toggle('positive', Number(value) > 0);
  node.classList.toggle('negative', Number(value) < 0);
}

function setHistoricValue(period, key, value, formatter = formatUsd) {
  if (!historicGrid) return;
  const card = historicGrid.querySelector(`[data-period="${period}"]`);
  if (!card) return;
  const node = card.querySelector(`[data-key="${key}"]`);
  if (!node) return;
  const formatted = formatter(value);
  animateValue(node, formatted);
  node.classList.toggle('positive', Number(value) > 0);
  node.classList.toggle('negative', Number(value) < 0);
}

async function loadBotWallet() {
  try {
    const response = await fetch('/api/bot-wallet');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    currentWallet = data.wallet;
    if (walletDisplay) {
      walletDisplay.textContent = data.wallet;
    }
    return data.wallet;
  } catch (error) {
    console.error('Error loading bot wallet:', error);
    if (walletDisplay) walletDisplay.textContent = 'Wallet unavailable';
    return null;
  }
}

function drawLineChart(canvas, labels, values) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpi = window.devicePixelRatio || 1;
  const width = canvas.clientWidth * dpi;
  const height = canvas.clientHeight * dpi;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(154, 230, 255, 0.5)';
  ctx.lineWidth = 2 * dpi;

  const padding = 30 * dpi;
  const maxValue = Math.max(...values.map(v => Math.abs(v)), 1);
  const xStep = (width - padding * 2) / (labels.length - 1);

  ctx.beginPath();
  values.forEach((value, index) => {
    const x = padding + xStep * index;
    const y = height / 2 - (value / maxValue) * (height / 2 - padding);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = 'rgba(154, 230, 255, 0.9)';
  values.forEach((value, index) => {
    const x = padding + xStep * index;
    const y = height / 2 - (value / maxValue) * (height / 2 - padding);
    ctx.beginPath();
    ctx.arc(x, y, 4 * dpi, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBarChart(canvas, labels, values) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpi = window.devicePixelRatio || 1;
  const width = canvas.clientWidth * dpi;
  const height = canvas.clientHeight * dpi;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  const padding = 30 * dpi;
  const maxValue = Math.max(...values, 1);
  const barWidth = (width - padding * 2) / values.length - 12 * dpi;

  values.forEach((value, index) => {
    const x = padding + index * (barWidth + 12 * dpi);
    const barHeight = (value / maxValue) * (height - padding * 2);
    const y = height - padding - barHeight;
    ctx.fillStyle = 'rgba(90, 212, 255, 0.6)';
    ctx.fillRect(x, y, barWidth, barHeight);
  });
}

function updateCharts(summary, historic) {
  const labels = ['1D', '7D', '30D'];
  const values = ['1d', '7d', '30d'].map(period => Number(historic?.[period]?.totalPnL ?? 0));
  drawLineChart(summaryChart || pnlLineChart, labels, values);

  const wins = ['1d', '7d', '30d'].map(period => Number(historic?.[period]?.wins ?? 0));
  const losses = ['1d', '7d', '30d'].map(period => Number(historic?.[period]?.losses ?? 0));
  const combined = wins.map((win, idx) => win + losses[idx]);
  drawBarChart(historicChart || pnlBarChart, labels, combined);
}

function updateWinLossPieChart(wins, losses) {
  const canvas = document.getElementById('winLossPieChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpi = window.devicePixelRatio || 1;
  const width = canvas.clientWidth * dpi;
  const height = canvas.clientHeight * dpi;
  canvas.width = width;
  canvas.height = height;
  ctx.scale(dpi, dpi);

  const centerX = canvas.clientWidth / 2;
  const centerY = canvas.clientHeight / 2;
  const radius = Math.min(centerX, centerY) - 20;

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  const total = wins + losses;
  if (total === 0) {
    // Draw empty circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(154, 230, 255, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(154, 230, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    return;
  }

  const winsAngle = (wins / total) * Math.PI * 2;
  const lossesAngle = (losses / total) * Math.PI * 2;

  // Draw wins segment
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + winsAngle);
  ctx.closePath();
  ctx.fillStyle = '#4ade80';
  ctx.fill();
  ctx.strokeStyle = 'rgba(12, 16, 24, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw losses segment
  if (losses > 0) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2 + winsAngle, -Math.PI / 2 + winsAngle + lossesAngle);
    ctx.closePath();
    ctx.fillStyle = '#f87171';
    ctx.fill();
    ctx.strokeStyle = 'rgba(12, 16, 24, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Update legend
  const winsCountEl = document.getElementById('winsCount');
  const lossesCountEl = document.getElementById('lossesCount');
  if (winsCountEl) winsCountEl.textContent = wins;
  if (lossesCountEl) lossesCountEl.textContent = losses;
}

async function loadWalletPnL() {
  if (!currentWallet) {
    await loadBotWallet();
  }

  if (!currentWallet) {
    walletStatus.textContent = 'Bot wallet not available.';
    return;
  }

  walletStatus.textContent = 'Fetching Einstein diagnostics...';

  try {
    const response = await fetch(`/api/pnl/${currentWallet}?showHistoricPnL=true&holdingCheck=true&hideDetails=true`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const summary = data.summary || {};
    const historic = data.historic?.summary || {};
    lastHistoric = historic;

    setSummaryValue('total', summary.total);
    setSummaryValue('realized', summary.realized);
    setSummaryValue('unrealized', summary.unrealized);
    setSummaryValue('totalInvested', summary.totalInvested);
    setSummaryValue('winPercentage', summary.winPercentage, formatPercent);
    setSummaryValue('lossPercentage', summary.lossPercentage, formatPercent);
    setSummaryValue('neutralPercentage', summary.neutralPercentage, formatPercent);
    setSummaryValue('averageBuyAmount', summary.averageBuyAmount);
    setSummaryValue('winsLosses', `${summary.totalWins ?? 0} / ${summary.totalLosses ?? 0}`, (v) => v);

    // Update 30D pie chart
    const period30d = historic?.['30d'] || {};
    const wins = period30d.wins || 0;
    const losses = period30d.losses || 0;
    updateWinLossPieChart(wins, losses);

    updateCharts(summary, historic);
    walletStatus.textContent = 'Einstein has updated the field.';
  } catch (error) {
    console.error('Error loading PnL:', error);
    walletStatus.textContent = 'Failed to load data. Check the API key or wallet address.';
  }
}

if (syncButton) {
  syncButton.addEventListener('click', loadWalletPnL);
}


loadBotWallet().then(loadWalletPnL);
setInterval(loadWalletPnL, 60 * 1000);
