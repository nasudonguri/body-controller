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
  var diff = 0.02;
  var status = 0;

  var hands = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  var camera = new Camera(v, {
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

        //forward
        if (m[4].x < m[8].x + diff && m[4].x > m[8].x - diff && m[4].y < m[8].y + diff && m[4].y > m[8].y - diff && status < 1) {
          status = 1;
          document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "right"
          }));
          setTimeout(() => status = 0, 500)
        }
        //back
        if (m[4].x < m[20].x + diff && m[4].x > m[20].x - diff && m[4].y < m[20].y + diff && m[4].y > m[20].y - diff && status < 1) {
          status = 1;
          document.dispatchEvent(new KeyboardEvent("keydown", {
            key: "left"
          }));
          setTimeout(() => status = 0, 500)
        }

        //draw
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
    camera.start()
  }
}