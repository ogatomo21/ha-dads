const fixtureStyles = `
  :host { display: block; font-size: var(--ha-font-size-m); }
  * { box-sizing: border-box; }
  ha-card { display: block; background: var(--dads-surface); color: var(--dads-text); margin-bottom: 16px; padding: 16px; }
  .label { display: block; font-weight: 700; overflow-wrap: anywhere; }
  .secondary { display: block; color: var(--dads-text-secondary); overflow-wrap: anywhere; }
  .value { font-size: var(--ha-font-size-2xl); font-weight: 700; }
  .value span { font-size: var(--ha-font-size-m); font-weight: 400; }
  .actions { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; }
  button { font: inherit; min-height: 44px; padding: 8px 16px; max-width: 100%; border-radius: var(--dads-radius); border: 1px solid var(--dads-border); background: var(--dads-surface); color: var(--dads-primary); cursor: pointer; overflow-wrap: anywhere; }
  button.primary { background: var(--dads-primary); color: var(--dads-on-primary); border-color: var(--dads-primary); }
  button.primary:hover { background: var(--dads-primary-hover); }
  button.primary:active { background: var(--dads-primary-active); }
  button:disabled { cursor: default; color: var(--dads-text-disabled); background: var(--dads-surface-secondary); }
  .warning { color: var(--dads-warning); }
  .error { color: var(--dads-error); }
  .success { color: var(--dads-success); }
  .notice { border-inline-start: 4px solid currentColor; padding-inline-start: 16px; }
  a { color: var(--dads-primary); }
`;

const fixtures = {
  power: `
    <ha-card><span class="label">リビングの照明</span><span class="secondary" id="light-state">点灯中</span>
    <div class="actions"><button class="primary" id="toggle-light" aria-pressed="true">消灯する</button><button id="details">詳細</button></div>
    <p id="detail-text" hidden>明るさ 80% · 照明の詳細を表示しています。</p></ha-card>
    <ha-card><span class="label">書斎デスクの周辺機器用コンセント（長い日本語ラベルの表示確認）</span><span class="secondary">OFF · 待機中</span>
    <div class="actions"><button id="toggle-power" aria-pressed="false">電源を入れる</button></div></ha-card>
  `,
  room: `
    <ha-card><span class="label">リビングの温度</span><div class="value">24.6 <span>°C</span></div><span class="secondary">快適な室温です</span></ha-card>
    <ha-card><span class="label">リビングの湿度</span><div class="value">48 <span>%</span></div><span class="secondary">5分前に更新</span></ha-card>
    <ha-card><span class="label">リビングのエアコン</span><span class="secondary">冷房 · 設定 25°C</span><div class="actions"><button disabled>利用不可の操作</button></div></ha-card>
  `,
  status: `
    <ha-card><div class="notice success"><span class="label">接続は正常です</span><span>機器からの更新を受信しています。</span></div></ha-card>
    <ha-card><div class="notice warning"><span class="label">バッテリー残量が少なくなっています</span><span>玄関センサーの電池交換を準備してください。</span></div></ha-card>
    <ha-card><div class="notice error"><span class="label">機器に接続できません</span><span>書斎の温度センサーは利用不可です。</span></div></ha-card>
  `,
};

async function initialize() {
  const response = await fetch('card-styles.json');
  if (!response.ok) throw new Error('プレビュー用CSSを取得できません');
  const styles = await response.json();
  class DadsFixture extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const shadow = this.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = `${fixtureStyles}\n${styles['card-mod-card-yaml']['.']}`;
      shadow.append(style);
      const container = document.createElement('div');
      container.innerHTML = fixtures[this.getAttribute('kind')] || '';
      shadow.append(container);
      shadow.querySelector('#toggle-light')?.addEventListener('click', event => {
        const on = event.currentTarget.getAttribute('aria-pressed') !== 'true';
        event.currentTarget.setAttribute('aria-pressed', String(on));
        event.currentTarget.textContent = on ? '消灯する' : '点灯する';
        shadow.querySelector('#light-state').textContent = on ? '点灯中' : '消灯中';
      });
      shadow.querySelector('#toggle-power')?.addEventListener('click', event => {
        const on = event.currentTarget.getAttribute('aria-pressed') !== 'true';
        event.currentTarget.setAttribute('aria-pressed', String(on));
        event.currentTarget.textContent = on ? '電源を切る' : '電源を入れる';
        event.currentTarget.closest('ha-card').querySelector('.secondary').textContent = on ? 'ON · 使用中' : 'OFF · 待機中';
      });
      shadow.querySelector('#details')?.addEventListener('click', () => {
        const text = shadow.querySelector('#detail-text');
        text.hidden = !text.hidden;
      });
    }
  }
  customElements.define('dads-fixture', DadsFixture);
  document.documentElement.dataset.ready = 'true';
}

const mode = document.querySelector('#mode');
const media = matchMedia('(prefers-color-scheme: dark)');
function applyMode() {
  document.documentElement.dataset.mode = mode.value === 'auto' ? (media.matches ? 'dark' : 'light') : mode.value;
}
mode.addEventListener('change', applyMode);
media.addEventListener('change', applyMode);
document.querySelector('#scale').addEventListener('change', event => {
  document.documentElement.style.setProperty('--ha-font-size-scale', event.target.value);
});
applyMode();
initialize().catch(error => {
  document.querySelector('.preview-note').textContent = error.message;
  console.error(error);
});
