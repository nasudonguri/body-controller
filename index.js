var s = document.createElement("script");
s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
document.head.appendChild(s);
var s = document.createElement("script");
s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
document.head.appendChild(s);
var s = document.createElement("script");
s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
document.head.appendChild(s);
s.onload = () => {
  var v = document.createElement('video');
  var c = document.createElement('canvas').getContext('2d');
  var d = 0.02;
  var t = 0;
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
          document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "right"
          }));
          setTimeout(() => t = 0, 500)
        }
        if (m[4].x < m[20].x + d && m[4].x > m[20].x - d && m[4].y < m[20].y + d && m[4].y > m[20].y - d && t < 1) {
          t = 1;
          document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "left"
          }));
          setTimeout(() => t = 0, 500)
        }
        drawConnectors(c, m, HAND_CONNECTIONS, {
          color: '#069',
          lineWidth: 3
        });
        drawLandmarks(c, m, {
          color: '#f30',
          lineWidth: 3
        })
      })
    }
    c.restore()
  });
  document.onclick = () => {
    cmr.start()
  }
}