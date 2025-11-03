/**
 * Konata RedGold Dialogue UI for SillyTavern v1.13.5
 * Author: GPT-5
 * 功能：自动将 [角色名] 对话文本渲染为红金主题卡片 + 左侧头像，玩家右侧蓝银主题。
 */

const avatarMap = {
  "董妵": "https://i.postimg.cc/YC8GLSM9/1762118116092.png",
  "貂蝉": "https://i.postimg.cc/YC8GLSM0/1762118371125.png",
  "夏侯惇": "https://i.postimg.cc/3wRyXHx7/1762119173735.png",
  "孙策": "https://i.postimg.cc/LsXqtM8J/1762119880166.png",
  "周瑜": "https://i.postimg.cc/9fM4djQw/1762119922194.png",
  "孙姈": "https://i.postimg.cc/1ztgGZ3D/1762120081011.png",
  "陆焰": "https://i.postimg.cc/SKsX6pxr/1762120196379.png",
  "袁绍": "https://i.postimg.cc/QMyFSnFk/1762120290777.png",
  "曹婥": "https://i.postimg.cc/rwg0RpMq/IMG-20251103-051232.png",
  "吕凤仙": "https://i.postimg.cc/FKBYGnYG/IMG-20251103-055725.png",
  "张娇": "https://i.postimg.cc/FKBYGnYC/IMG-20251103-055745.png",
  "刘蓓": "https://i.postimg.cc/yNbDnrDb/IMG-20251103-055801.png",
  "关云": "https://i.postimg.cc/W4HdSfDV/IMG-20251103-055815.png",
  "张绯": "https://i.postimg.cc/W4HdSfDj/IMG-20251103-055827.png",
  "赵云": "https://i.postimg.cc/SsYJP793/IMG-20251103-055845.png",
  "诸葛亮": "https://i.postimg.cc/RFJNYQfx/IMG-20251103-055911.png",
  "许褚": "https://i.postimg.cc/FRk76gcN/IMG-20251103-055937.png",
  "郭嘉": "https://i.postimg.cc/j5nL1QNs/IMG-20251103-055948.png",
  "荀彧": "https://i.postimg.cc/d1ZLfmds/IMG-20251103-060004.png",
  "于吉": "https://i.postimg.cc/x8rcVJyT/IMG-20251103-060043.png",
  "南华": "https://i.postimg.cc/qqfzHhX7/IMG-20251103-060052.png",
  "左慈": "https://i.postimg.cc/d3MLckm1/IMG-20251103-060103.png"
};

export function init() {
  console.log("[KonataUI] 红金主题UI 已加载。");

  // 注入样式
  if (!document.getElementById("konata-redgold-style")) {
    const style = document.createElement("style");
    style.id = "konata-redgold-style";
    style.textContent = `
    .konata-bubble {
      display: flex;
      align-items: flex-start;
      max-width: 90%;
      margin: 10px auto;
      padding: 15px 18px;
      border-radius: 16px;
      color: #FFF8DC;
      font-family: 'Inter','Noto Sans SC','Microsoft YaHei',sans-serif;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
      animation: fadeInKonata 0.45s ease forwards;
      opacity: 0;
      transform: translateY(10px);
      word-wrap: break-word;
    }
    @keyframes fadeInKonata { to { opacity: 1; transform: none; } }

    .konata-left {
      background: linear-gradient(135deg, rgba(120,20,20,0.95), rgba(180,120,30,0.9));
      border-left: 5px solid #D4AF37;
      border-right: 5px solid #B8860B;
      flex-direction: row;
    }

    .konata-right {
      background: linear-gradient(135deg, rgba(30,50,100,0.95), rgba(80,140,200,0.9));
      border-left: 5px solid #87CEFA;
      border-right: 5px solid #1E90FF;
      flex-direction: row-reverse;
      text-align: right;
    }

    .konata-avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      border: 3px solid #D4AF37;
      box-shadow: 0 0 12px rgba(212,175,55,0.7);
      flex-shrink: 0;
      margin: 0 12px;
    }

    .konata-content { flex: 1; }
    .konata-name {
      font-weight: 700;
      margin-bottom: 5px;
      font-size: 1.05em;
      color: #FFD700;
      text-shadow: 0 0 6px #8B0000;
    }
    .konata-right .konata-name {
      color: #E0FFFF;
      text-shadow: 0 0 6px #4682B4;
    }

    .konata-text {
      line-height: 1.8;
      font-size: 1em;
      text-shadow: 0 0 6px rgba(0,0,0,0.4);
    }
    `;
    document.head.appendChild(style);
  }

  // 监听聊天更新
  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node instanceof HTMLElement && node.matches(".mes")) {
          processMessage(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll(".mes").forEach(n => processMessage(n));
}

function processMessage(node) {
  const textBlock = node.querySelector(".mes_text");
  if (!textBlock || textBlock.dataset.konataProcessed) return;

  const raw = textBlock.innerText.trim();
  const match = raw.match(/^[\\[【]([^\\]】]+)[\\]】]\\s*(.*)$/);
  if (!match) return;

  const name = match[1].trim();
  const text = match[2].trim();

  const isPlayer = /^(我|主公|玩家|我方)$/.test(name);

  const bubble = document.createElement("div");
  bubble.className = "konata-bubble " + (isPlayer ? "konata-right" : "konata-left");

  const avatar = document.createElement("div");
  avatar.className = "konata-avatar";
  avatar.style.backgroundImage = `url('${avatarMap[name] || ""}')`;

  const content = document.createElement("div");
  content.className = "konata-content";

  const nameEl = document.createElement("div");
  nameEl.className = "konata-name";
  nameEl.textContent = name;

  const textEl = document.createElement("div");
  textEl.className = "konata-text";
  textEl.textContent = text;

  content.appendChild(nameEl);
  content.appendChild(textEl);
  bubble.appendChild(avatar);
  bubble.appendChild(content);

  textBlock.innerHTML = "";
  textBlock.appendChild(bubble);
  textBlock.dataset.konataProcessed = "1";
}
