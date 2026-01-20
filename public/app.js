// Nombres de variables para mostrar
const variableNames = {
  marketCap: 'Market Cap',
  priceChangeH1: 'Price Change H1',
  priceChangeH6: 'Price Change H6',
  priceChangeH24: 'Price Change H24',
  priceChange1m: 'Price Change 1m',
  priceChange3m: 'Price Change 3m',
  priceChange5m: 'Price Change 5m',
  priceChange10m: 'Price Change 10m',
  priceChange30m: 'Price Change 30m',
  volumeRelativoM5: 'Volume Relativo M5',
  volumeRelativoH1: 'Volume Relativo H1',
  volumeRelativoH6: 'Volume Relativo H6',
  volumeRelativoH24: 'Volume Relativo H24',
  ratioComprasVentasM5: 'Ratio Compras/Ventas M5',
  ratioComprasVentasH1: 'Ratio Compras/Ventas H1',
  ratioComprasVentasH6: 'Ratio Compras/Ventas H6'
};

const correlationsContent = document.getElementById('correlationsContent');
const resultsPanel = document.getElementById('resultsPanel');
const resultsContent = document.getElementById('resultsContent');
const backtestForm = document.getElementById('backtestForm');

// Inicializar sliders
function initializeSliders() {
  const sliders = document.querySelectorAll('.slider');
  sliders.forEach(slider => {
    const valueSpan = document.getElementById(slider.id + 'Value');
    if (valueSpan) {
      updateSliderValue(slider, valueSpan);
      slider.addEventListener('input', () => updateSliderValue(slider, valueSpan));
    }
  });
}

function updateSliderValue(slider, valueSpan) {
  let value = parseFloat(slider.value);
  if (slider.id.includes('marketCap')) {
    valueSpan.textContent = formatNumber(value);
  } else if (slider.id.includes('priceChange') || slider.id.includes('volumeRelativo')) {
    valueSpan.textContent = value.toFixed(1);
  } else if (slider.id.includes('ratioComprasVentas')) {
    valueSpan.textContent = value.toFixed(2);
  } else if (slider.id === 'holdTime') {
    valueSpan.textContent = value;
  } else if (slider.id === 'takeProfit' || slider.id === 'stopLoss') {
    valueSpan.textContent = value.toFixed(1);
  } else if (slider.id === 'maxProfitPerTrade') {
    valueSpan.textContent = value === 0 ? 'Sin límite' : value.toFixed(0);
  } else {
    valueSpan.textContent = value;
  }
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatNumberFull(num) {
  return parseFloat(num).toLocaleString('es-ES');
}

// Cargar correlaciones al inicio
async function loadCorrelations() {
  try {
    const response = await fetch('/api/correlations');
    const data = await response.json();
    if (data.success) {
      displayCorrelations(data.correlations);
    } else {
      correlationsContent.innerHTML = '<div class="error">Error cargando correlaciones</div>';
    }
  } catch (error) {
    correlationsContent.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
  }
}

function displayCorrelations(correlations, holdTime = 60) {
  const sorted = Object.entries(correlations)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  
  // Actualizar título del panel
  const correlationsPanel = document.getElementById('correlationsPanel');
  if (correlationsPanel) {
    const titleElement = correlationsPanel.querySelector('h2');
    if (titleElement) {
      titleElement.textContent = `Correlaciones con Profit (${holdTime} consultas)`;
    }
  }
  
  const html = `
    <div class="correlations-grid">
      ${sorted.map(([key, value]) => {
        const isPositive = value >= 0;
        const absValue = Math.abs(value);
        const sign = isPositive ? '+' : '';
        const trend = isPositive ? '↑ Aumenta profit' : '↓ Disminuye profit';
        return `
          <div class="correlation-card ${isPositive ? 'positive' : 'negative'}">
            <div class="correlation-label">${variableNames[key] || key}</div>
            <div class="correlation-value ${isPositive ? 'positive' : 'negative'}">
              ${sign}${value.toFixed(4)}
            </div>
            <div style="margin-top: 8px; font-size: 0.75em; color: var(--text-secondary);">
              ${getCorrelationStrength(absValue)}
            </div>
            <div class="correlation-trend ${isPositive ? 'positive' : 'negative'}">
              ${trend}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  correlationsContent.innerHTML = html;
}

function getCorrelationStrength(value) {
  if (value >= 0.7) return 'Muy Fuerte';
  if (value >= 0.5) return 'Fuerte';
  if (value >= 0.3) return 'Moderada';
  if (value >= 0.1) return 'Débil';
  return 'Muy Débil';
}

// Manejar envío del formulario
backtestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const conditions = {
    marketCapMin: (() => {
      const value = parseFloat(document.getElementById('marketCapMin').value);
      return isNaN(value) ? undefined : value;
    })(),
    marketCapMax: (() => {
      const value = parseFloat(document.getElementById('marketCapMax').value);
      return isNaN(value) ? undefined : value;
    })(),
    priceChangeH1Min: parseFloat(document.getElementById('priceChangeH1Min').value) || undefined,
    priceChangeH1Max: parseFloat(document.getElementById('priceChangeH1Max').value) || undefined,
    priceChangeH6Min: parseFloat(document.getElementById('priceChangeH6Min').value) || undefined,
    priceChangeH6Max: parseFloat(document.getElementById('priceChangeH6Max').value) || undefined,
    priceChangeH24Min: parseFloat(document.getElementById('priceChangeH24Min').value) || undefined,
    priceChangeH24Max: parseFloat(document.getElementById('priceChangeH24Max').value) || undefined,
    priceChange1mMin: parseFloat(document.getElementById('priceChange1mMin').value) || undefined,
    priceChange1mMax: parseFloat(document.getElementById('priceChange1mMax').value) || undefined,
    priceChange3mMin: parseFloat(document.getElementById('priceChange3mMin').value) || undefined,
    priceChange3mMax: parseFloat(document.getElementById('priceChange3mMax').value) || undefined,
    priceChange5mMin: parseFloat(document.getElementById('priceChange5mMin').value) || undefined,
    priceChange5mMax: parseFloat(document.getElementById('priceChange5mMax').value) || undefined,
    priceChange10mMin: parseFloat(document.getElementById('priceChange10mMin').value) || undefined,
    priceChange10mMax: parseFloat(document.getElementById('priceChange10mMax').value) || undefined,
    priceChange30mMin: parseFloat(document.getElementById('priceChange30mMin').value) || undefined,
    priceChange30mMax: parseFloat(document.getElementById('priceChange30mMax').value) || undefined,
    volumeRelativoM5Min: parseFloat(document.getElementById('volumeRelativoM5Min').value) || undefined,
    volumeRelativoM5Max: parseFloat(document.getElementById('volumeRelativoM5Max').value) || undefined,
    volumeRelativoH1Min: parseFloat(document.getElementById('volumeRelativoH1Min').value) || undefined,
    volumeRelativoH1Max: parseFloat(document.getElementById('volumeRelativoH1Max').value) || undefined,
    volumeRelativoH6Min: parseFloat(document.getElementById('volumeRelativoH6Min').value) || undefined,
    volumeRelativoH6Max: parseFloat(document.getElementById('volumeRelativoH6Max').value) || undefined,
    volumeRelativoH24Min: parseFloat(document.getElementById('volumeRelativoH24Min').value) || undefined,
    volumeRelativoH24Max: parseFloat(document.getElementById('volumeRelativoH24Max').value) || undefined,
    ratioComprasVentasM5Min: parseFloat(document.getElementById('ratioComprasVentasM5Min').value) || undefined,
    ratioComprasVentasM5Max: parseFloat(document.getElementById('ratioComprasVentasM5Max').value) || undefined,
    ratioComprasVentasH1Min: parseFloat(document.getElementById('ratioComprasVentasH1Min').value) || undefined,
    ratioComprasVentasH1Max: parseFloat(document.getElementById('ratioComprasVentasH1Max').value) || undefined,
    ratioComprasVentasH6Min: parseFloat(document.getElementById('ratioComprasVentasH6Min').value) || undefined,
    ratioComprasVentasH6Max: parseFloat(document.getElementById('ratioComprasVentasH6Max').value) || undefined,
    holdTime: parseFloat(document.getElementById('holdTime').value) || 60,
    takeProfit: parseFloat(document.getElementById('takeProfit').value) || undefined,
    stopLoss: parseFloat(document.getElementById('stopLoss').value) || undefined,
    maxProfitPerTrade: (() => {
      const value = parseFloat(document.getElementById('maxProfitPerTrade').value);
      return isNaN(value) ? undefined : value;
    })()
  };
  
  // Eliminar valores undefined (si maxProfitPerTrade es 0, también eliminarlo porque significa "sin límite")
  Object.keys(conditions).forEach(key => {
    if (conditions[key] === undefined || (key === 'maxProfitPerTrade' && conditions[key] === 0)) {
      delete conditions[key];
    }
  });
  
  try {
    resultsContent.innerHTML = '<div class="loading">Ejecutando backtest...</div>';
    resultsPanel.style.display = 'block';
    
    const response = await fetch('/api/backtest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conditions)
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayResults(data.results);
      if (data.correlations) {
        const holdTime = conditions.holdTime || 60;
        displayCorrelations(data.correlations, holdTime);
      }
    } else {
      resultsContent.innerHTML = '<div class="error">Error: ' + data.error + '</div>';
    }
  } catch (error) {
    resultsContent.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
  }
});

function displayResults(results) {
  const html = `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Trades</div>
        <div class="metric-value">${results.totalTrades}</div>
      </div>
      <div class="metric-card ${parseFloat(results.winRate) >= 50 ? 'positive' : 'negative'}">
        <div class="metric-label">Win Rate</div>
        <div class="metric-value">${results.winRate.toFixed(2)}%</div>
      </div>
      <div class="metric-card positive">
        <div class="metric-label">Trades Ganadores</div>
        <div class="metric-value">${results.winningTrades}</div>
      </div>
      <div class="metric-card negative">
        <div class="metric-label">Trades Perdedores</div>
        <div class="metric-value">${results.losingTrades}</div>
      </div>
      <div class="metric-card ${parseFloat(results.netProfitPercent) >= 0 ? 'positive' : 'negative'}">
        <div class="metric-label">Profit Neto (%)</div>
        <div class="metric-value">${formatNumberFull(results.netProfitPercent)}%</div>
      </div>
      <div class="metric-card positive">
        <div class="metric-label">Profit Total (%)</div>
        <div class="metric-value">${formatNumberFull(results.totalProfitPercent.toFixed(2))}%</div>
      </div>
      <div class="metric-card negative">
        <div class="metric-label">Loss Total (%)</div>
        <div class="metric-value">${formatNumberFull(results.totalLossPercent.toFixed(2))}%</div>
      </div>
      <div class="metric-card ${parseFloat(results.avgProfitPercent) >= 0 ? 'positive' : 'negative'}">
        <div class="metric-label">Avg Profit (%)</div>
        <div class="metric-value">${formatNumberFull(results.avgProfitPercent)}%</div>
      </div>
      <div class="metric-card negative">
        <div class="metric-label">Avg Loss (%)</div>
        <div class="metric-value">${formatNumberFull(results.avgLossPercent)}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Profit/Loss Ratio</div>
        <div class="metric-value">${results.profitLossRatio}</div>
      </div>
    </div>
    ${results.equityCurve && results.equityCurve.length > 0 ? `
      <div style="margin-top: 30px;">
        <h3 style="margin-bottom: 15px; color: var(--text-primary);">Curva de Equity</h3>
        <div class="equity-curve-container">
          <canvas id="equityCurveChart"></canvas>
        </div>
      </div>
    ` : ''}
    ${results.trades.length > 0 ? `
      <div style="margin-top: 30px;">
        <h3 style="margin-bottom: 15px; color: var(--text-primary);">Top 50 Trades por PNL</h3>
        <div class="trades-table-container">
          <table class="trades-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Precio Entrada</th>
                <th>Precio Salida</th>
                <th>Profit %</th>
                <th>Profit (USD)</th>
              </tr>
            </thead>
            <tbody>
              ${results.trades
                .map(trade => ({
                  ...trade,
                  profitPercentNum: parseFloat(trade.profitPercent) || 0
                }))
                .sort((a, b) => b.profitPercentNum - a.profitPercentNum)
                .slice(0, 50)
                .map(trade => `
                <tr>
                  <td style="font-family: monospace; font-size: 0.85em; word-break: break-all;">${trade.token}</td>
                  <td>${trade.entryConsulta}</td>
                  <td>${trade.exitConsulta}</td>
                  <td>${formatNumberFull(trade.entryPrice.toFixed(2))}</td>
                  <td>${formatNumberFull(trade.exitPrice.toFixed(2))}</td>
                  <td class="${trade.profitPercentNum >= 0 ? 'profit-positive' : 'profit-negative'}" style="font-weight: 600; font-size: 1.05em;">
                    ${trade.profitPercent}%
                  </td>
                  <td class="${trade.profitPercentNum >= 0 ? 'profit-positive' : 'profit-negative'}" style="opacity: 0.7; font-size: 0.9em;">
                    ${formatNumberFull(trade.profit.toFixed(2))}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ${results.worstLosses && results.worstLosses.length > 0 ? `
        <div style="margin-top: 30px;">
          <h3 style="margin-bottom: 15px; color: var(--text-primary);">Top 10 Mayores Pérdidas (%)</h3>
          <div class="trades-table-container">
            <table class="trades-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Precio Entrada</th>
                  <th>Precio Salida</th>
                  <th>Pérdida %</th>
                  <th>Pérdida (USD)</th>
                </tr>
              </thead>
              <tbody>
                ${results.worstLosses.map(trade => `
                  <tr>
                    <td style="font-family: monospace; font-size: 0.85em; word-break: break-all;">${trade.token}</td>
                    <td>${trade.entryConsulta}</td>
                    <td>${trade.exitConsulta}</td>
                    <td>${formatNumberFull(trade.entryPrice.toFixed(2))}</td>
                    <td>${formatNumberFull(trade.exitPrice.toFixed(2))}</td>
                    <td class="profit-negative" style="font-weight: 600; font-size: 1.05em;">
                      ${trade.profitPercent}%
                    </td>
                    <td class="profit-negative" style="opacity: 0.7; font-size: 0.9em;">
                      ${formatNumberFull(trade.profit.toFixed(2))}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    ` : '<p>No se encontraron trades con estas condiciones.</p>'}
  `;
  resultsContent.innerHTML = html;
  resultsPanel.classList.add('show');
  resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // Dibujar equity curve si existe
  if (results.equityCurve && results.equityCurve.length > 0) {
    drawEquityCurve(results.equityCurve);
  }
}

function drawEquityCurve(equityCurve) {
  const canvas = document.getElementById('equityCurveChart');
  if (!canvas) return;
  
  // Configurar alta resolución
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  const width = rect.width;
  const height = rect.height;
  const padding = { top: 50, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Encontrar min y max equity con márgenes
  const equities = equityCurve.map(p => p.equity);
  const minEquity = Math.min(...equities, 0);
  const maxEquity = Math.max(...equities, 0);
  const range = maxEquity - minEquity || 1;
  const margin = range * 0.1; // 10% de margen
  
  // Escala
  const xScale = chartWidth / (equityCurve.length - 1 || 1);
  const yScale = chartHeight / (range + margin * 2);
  
  // Fondo del gráfico
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary') || '#1a1d29';
  ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);
  
  // Cuadrícula horizontal
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#2d3441';
  ctx.lineWidth = 1;
  const gridLines = 6;
  for (let i = 0; i <= gridLines; i++) {
    const value = minEquity - margin + ((range + margin * 2) * i / gridLines);
    const y = padding.top + chartHeight - ((value - (minEquity - margin)) * yScale);
    
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
  }
  
  // Cuadrícula vertical (menos líneas)
  const verticalLines = Math.min(8, equityCurve.length);
  for (let i = 0; i <= verticalLines; i++) {
    const index = Math.floor((i / verticalLines) * (equityCurve.length - 1));
    const x = padding.left + index * xScale;
    
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.stroke();
  }
  
  // Línea base (equity = 0)
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') || '#9ca3af';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  const baselineY = padding.top + chartHeight - ((0 - (minEquity - margin)) * yScale);
  if (baselineY >= padding.top && baselineY <= padding.top + chartHeight) {
    ctx.beginPath();
    ctx.moveTo(padding.left, baselineY);
    ctx.lineTo(padding.left + chartWidth, baselineY);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  
  // Gradiente para el relleno
  const isPositive = equityCurve[equityCurve.length - 1].equity >= 0;
  const gradient = ctx.createLinearGradient(padding.left, padding.top, padding.left, padding.top + chartHeight);
  
  if (isPositive) {
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
  } else {
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
  }
  
  // Relleno bajo la curva
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top + chartHeight - ((equityCurve[0].equity - (minEquity - margin)) * yScale));
  
  equityCurve.forEach((point, index) => {
    const x = padding.left + index * xScale;
    const y = padding.top + chartHeight - ((point.equity - (minEquity - margin)) * yScale);
    ctx.lineTo(x, y);
  });
  
  ctx.lineTo(padding.left + (equityCurve.length - 1) * xScale, padding.top + chartHeight);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.closePath();
  ctx.fill();
  
  // Dibujar línea de equity (más gruesa y suave)
  ctx.strokeStyle = isPositive 
    ? getComputedStyle(document.documentElement).getPropertyValue('--success-color') || '#10b981'
    : getComputedStyle(document.documentElement).getPropertyValue('--danger-color') || '#ef4444';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = isPositive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  
  equityCurve.forEach((point, index) => {
    const x = padding.left + index * xScale;
    const y = padding.top + chartHeight - ((point.equity - (minEquity - margin)) * yScale);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Puntos en puntos clave
  ctx.fillStyle = ctx.strokeStyle;
  const keyPoints = [0, Math.floor(equityCurve.length / 2), equityCurve.length - 1];
  keyPoints.forEach(pointIndex => {
    if (pointIndex < equityCurve.length) {
      const x = padding.left + pointIndex * xScale;
      const y = padding.top + chartHeight - ((equityCurve[pointIndex].equity - (minEquity - margin)) * yScale);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Etiquetas de ejes
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#ffffff';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Eje X - etiquetas
  const xTicks = Math.min(6, equityCurve.length);
  for (let i = 0; i < xTicks; i++) {
    const index = Math.floor((i / (xTicks - 1)) * (equityCurve.length - 1));
    const x = padding.left + index * xScale;
    ctx.fillText(equityCurve[index].trade.toString(), x, height - padding.bottom / 2);
  }
  
  // Título eje X
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Número de Trade', width / 2, height - 10);
  
  // Eje Y - etiquetas
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  for (let i = 0; i <= gridLines; i++) {
    const value = minEquity - margin + ((range + margin * 2) * i / gridLines);
    const y = padding.top + chartHeight - ((value - (minEquity - margin)) * yScale);
    const label = value >= 1000 || value <= -1000 
      ? value.toFixed(0) 
      : value.toFixed(1);
    ctx.fillText(label + '%', padding.left - 15, y);
  }
  
  // Título eje Y
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Equity (%)', 0, 0);
  ctx.restore();
  
  // Valor final destacado
  const lastPoint = equityCurve[equityCurve.length - 1];
  const lastX = padding.left + (equityCurve.length - 1) * xScale;
  const lastY = padding.top + chartHeight - ((lastPoint.equity - (minEquity - margin)) * yScale);
  
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Etiqueta del valor final
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#ffffff';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  const finalLabel = lastPoint.equity >= 1000 || lastPoint.equity <= -1000
    ? lastPoint.equity.toFixed(0) + '%'
    : lastPoint.equity.toFixed(1) + '%';
  ctx.fillText(finalLabel, lastX, lastY - 12);
}

function exportConfig() {
  const conditions = {};
  const inputs = document.querySelectorAll('#backtestForm input[type="range"]');
  
  inputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      conditions[input.id] = value;
    }
  });
  
  const dataStr = JSON.stringify(conditions, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `strategy_config_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importConfig() {
  document.getElementById('configFileInput').click();
}

function handleConfigFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const conditions = JSON.parse(e.target.result);
      applyStrategy(conditions);
      alert('Configuración importada correctamente');
    } catch (error) {
      alert('Error al importar configuración: ' + error.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function applyStrategy(conditions) {
  Object.keys(conditions).forEach(key => {
    const input = document.getElementById(key);
    if (input && conditions[key] !== undefined) {
      input.value = conditions[key];
      const valueSpan = document.getElementById(key + 'Value');
      if (valueSpan) {
        updateSliderValue(input, valueSpan);
      }
    }
  });
}

function resetForm() {
  backtestForm.reset();
  initializeSliders();
  resultsPanel.style.display = 'none';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initializeSliders();
  loadCorrelations();
});

// Exportar funciones globales para onclick
window.resetForm = resetForm;
window.exportConfig = exportConfig;
window.importConfig = importConfig;
window.handleConfigFile = handleConfigFile;
