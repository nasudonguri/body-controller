var s = document.createElement("script");
s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
document.head.appendChild(s);
var s = document.createElement("script");
s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
document.head.appendChild(s);
var s = document.createElement("script");
s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
document.head.appendChild(s);
var l = document.createElement("link");
l.setAttribute('rel', 'stylesheet');
l.href = 'https://cdn.jsdelivr.net/npm/purecss@2.1.0/build/pure-min.css';
document.head.appendChild(l);
var l = document.createElement("link");
l.setAttribute('rel', 'stylesheet');
l.href = 'https://www.ykhm.f5.si/finger/finger.css';
document.head.appendChild(l);
var main_tab;
l.onload = () => {
  document.body.innerHTML += '<div id="finger" data-open><form class="pure-form" onsubmit="return false;"><input type="text" readonly id="finger_status"></input></form><div class="pure-button-group"><select id="finger_far" class="pure-button"><option value="0.04">近</option><option value="0.02">中</option><option value="0.01">遠</option></select><button id="finger_start" class="pure-button">開始</button><button id="finger_stop" class="pure-button">停止</button><p>開始を押すと新しいタブが開きます。開いたらすぐにこのタブに戻ってください。</p><div id="finger_view"></div><canvas id="finger_out" width="600" height="400"></canvas></div></div><button id="finger_icon" class="pure-button">☝️</button>';
  var v = document.createElement('video');
  var c = document.getElementById('finger_out').getContext('2d');
  var d = 0.06;
  var t = 0;
  var s = '';
  var hands = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  var cmr = new Camera(v, {
    onFrame: async() => {
      await hands.send({
        image: v
      })
    },
    width: 600,
    height: 400
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.3,
    minTrackingConfidence: 0.3
  });
  hands.onResults(r => {
    c.save();
    c.scale(-1, 1);
    c.translate(-600, 0);
    c.clearRect(0, 0, 600, 400);
    c.drawImage(r.image, 0, 0, 600, 400);
    if (r.multiHandLandmarks) {
      r.multiHandLandmarks.forEach(m => {
        if (m[4].x < m[8].x + d && m[4].x > m[8].x - d && m[4].y < m[8].y + d && m[4].y > m[8].y - d && t < 1) {
          t = 1;
          document.getElementById('finger_status').value = '次のスライド';
          main_tab.document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "right"
          }));
          setTimeout(() => t = 0, 500)
        } else document.getElementById('finger_status').value = '';
        drawConnectors(c, m, HAND_CONNECTIONS, {
          color: '#069',
          lineWidth: 3
        });
        drawLandmarks(c, m, {
          color: '#f30',
          lineWidth: 3
        })
      })
    } else document.getElementById('finger_status').value = '';
    c.restore()
  });
  document.getElementById('finger_start').onclick = () => {
    main_tab = window.open(location.href.replace(/edit(#|\?)/, 'present?'));
    setTimeout(() => cmr.start(), 5000)
  };
  document.getElementById('finger_stop').onclick = () => {
    cmr.stop();
    document.getElementById('finger').removeAttribute('data-open')
  };
  document.getElementById('finger_far').onchange = () => d = Number(document.getElementById('finger_far').value);
  document.getElementById('finger_icon').onclick = () => document.getElementById('finger').setAttribute('data-open', '');
  setInterval(() => {
    if (main_tab || !main_tab.closed) document.getElementById('finger_view').innerHTML = main_tab.document.querySelector('body > div:nth-child(12) > div.punch-viewer-container > div > div > div > div > div.punch-viewer-svgpage-svgcontainer > svg').outerHTML
  }, 3000)
}