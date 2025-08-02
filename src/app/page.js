'use client';
import { useState, useRef } from 'react';
import styles from './page.module.css';
import confetti from 'canvas-confetti';

export default function Home() {
  const [exp, setExp] = useState(0);
  const [air, setAir] = useState(0);
  const [messages, setMessages] = useState([]);
  const [notif, setNotif] = useState(null);
  const [gmReady, setGmReady] = useState(false);
  const [gmActive, setGmActive] = useState(false);
  const [floating, setFloating] = useState([]);
  const [buttonText, setButtonText] = useState('Create thread');
  const [showMailbox, setShowMailbox] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const inputRef = useRef();

  const buttonLabels = [
    'Create thread',
    'Create Memes',
    'Create post',
    'IDK what to post'
  ];

  const generateCode = () => {
    return Array.from({ length: 8 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))
    ).join('');
  };

  const handleClick = (e) => {
    const gain = gmActive ? 20 : 10;
    const newExp = exp + gain;
    setExp(newExp >= 1000 ? 0 : newExp);
    setFloating([...floating, { id: Date.now(), x: e.clientX, y: e.clientY, text: `+${gain}` }]);
    setButtonText(buttonLabels[Math.floor(Math.random() * buttonLabels.length)]);

    if (newExp >= 1000) {
      const code = generateCode();
      setMessages([...messages, { code }]);
      setNotif(code);
      setGmReady(true);
      setTimeout(() => setNotif(null), 4000);
    }
  };

  const handleSayGM = () => {
    confetti();
    setGmActive(true);
    setGmReady(false); // ✅ Reset so button disappears
    setTimeout(() => {
      setGmActive(false);
    }, 10000);
  };

  const handleWindowDrag = (e, target) => {
    const shiftX = e.clientX - target.getBoundingClientRect().left;
    const shiftY = e.clientY - target.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      target.style.left = pageX - shiftX + 'px';
      target.style.top = pageY - shiftY + 'px';
    };

    const onMouseMove = (e) => moveAt(e.pageX, e.pageY);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  };

  const handleRedeem = () => {
    const code = inputRef.current?.value?.trim();
    if (!code) return;
    // Simple validation: check if code was received
    const match = messages.find((m) => m.code === code);
    if (match) {
      const reward = Math.floor(Math.random() * 90001) + 10000; // 10k to 100k
      setAir((prev) => prev + reward);
      alert(`Success! You received ${reward.toLocaleString()} $AIR.`);
    } else {
      alert('Invalid code.');
    }
    inputRef.current.value = '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={() => setShowMailbox(true)}>Mailbox</button>
        <button onClick={() => setShowRedeem(true)}>Redeem</button>
      </div>

      <div className={styles.airBalance}>$AIR: {air.toLocaleString()}</div>

      {notif && (
        <div className={styles.notification}>
          <div><strong>Ethereum_OS:</strong></div>
          <div style={{ fontFamily: 'monospace' }}>[{notif}] Welcome!</div>
        </div>
      )}

      <div className={styles.centerContainer}>
        <button className={styles.mainBtn} onClick={handleClick}>
          {buttonText}
        </button>
        <div className={styles.guideText}>Keep clicking and you'll know the result</div>
        {gmReady && !gmActive && (
          <button className={styles.sayGMBtn} onClick={handleSayGM}>Say GM!</button>
        )}
      </div>

      <div className={styles.expBar}>
        <div className={styles.expFill} style={{ height: `${(exp / 1000) * 100}%` }} />
      </div>
      <div className={styles.expValue}>{exp} / 1000</div>

      {floating.map((f) => (
        <div
          key={f.id}
          className={styles.floatingText}
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </div>
      ))}

      {showMailbox && (
        <div className={styles.rewardWindow} style={{ top: '120px', left: '120px' }}>
          <div
            className={styles.windowHeader}
            onMouseDown={(e) => handleWindowDrag(e, e.currentTarget.parentElement)}
          >
            Mailbox
            <button className={styles.closeBtn} onClick={() => setShowMailbox(false)}>X</button>
          </div>
          <div className={styles.messageList}>
            {messages.map((m, i) => (
              <div key={i} className={styles.messageItem}>
                <strong>Ethereum_OS:</strong> [{m.code}] Welcome!
              </div>
            ))}
          </div>
        </div>
      )}

      {showRedeem && (
        <div className={styles.rewardWindow} style={{ top: '160px', left: '160px' }}>
          <div
            className={styles.windowHeader}
            onMouseDown={(e) => handleWindowDrag(e, e.currentTarget.parentElement)}
          >
            Redeem Code
            <button className={styles.closeBtn} onClick={() => setShowRedeem(false)}>X</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px' }}>
            <input className={styles.redeemInput} ref={inputRef} placeholder="Enter your code" />
            <button className={styles.topBarButton} onClick={handleRedeem}>Redeem</button>
          </div>
        </div>
      )}
    </div>
  );
}
