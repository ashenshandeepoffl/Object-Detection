async function loadModel() {
    const model = await cocoSsd.load();
    return model;
  }
  
  // Detect objects in the video stream
  async function detectObjects(model, video) {
    const canvas = document.getElementById('output');
    const context = canvas.getContext('2d');
    const objectList = document.getElementById('object-list');
  
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the camera feed on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const predictions = await model.detect(video);
  
    // Clear previous objects from the list
    objectList.innerHTML = '';
  
    predictions.forEach(prediction => {
      context.beginPath();
      context.rect(
        prediction.bbox[0], prediction.bbox[1],
        prediction.bbox[2], prediction.bbox[3]
      );
      context.lineWidth = 2;
      context.strokeStyle = 'red';
      context.fillStyle = 'red';
      context.stroke();
      context.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
  
      // Add identified object to the table
      const row = objectList.insertRow();
      row.insertCell(0).textContent = prediction.class;
      row.insertCell(1).textContent = `${Math.round(prediction.score * 100)}%`;
    });
  
    requestAnimationFrame(() => detectObjects(model, video));
  }
  
  // Get user media
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(async (stream) => {
      const video = document.getElementById('webcam');
      video.srcObject = stream;
  
      const model = await loadModel();
      detectObjects(model, video);
    })
    .catch((error) => {
      console.error('Error accessing camera:', error);
    });
  