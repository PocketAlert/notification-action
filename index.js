const https = require('https');
const fs = require('fs');

async function sendNotification() {
  try {
    // Get inputs from environment variables (GitHub Actions sets these automatically)
    const token = process.env.INPUT_TOKEN;
    const title = process.env.INPUT_TITLE;
    const message = process.env.INPUT_MESSAGE;
    const applicationId = process.env.INPUT_APPLICATION_ID;
    const deviceId = process.env.INPUT_DEVICE_ID;

    // Validate required inputs
    if (!token) {
      throw new Error('Token is required');
    }
    if (!title) {
      throw new Error('Title is required');
    }
    if (!message) {
      throw new Error('Message is required');
    }

    // Prepare payload
    const payload = {
      title: title,
      message: message
    };

    if (applicationId) {
      payload.application_id = applicationId;
    }

    if (deviceId) {
      payload.device_id = deviceId;
    }

    console.log('Sending notification to Pocket Alert...');
    console.log(`Title: ${title}`);
    console.log(`Message: ${message}`);
    if (applicationId) {
      console.log(`Application ID: ${applicationId}`);
    }
    if (deviceId) {
      console.log(`Device ID: ${deviceId}`);
    }

    // Make API request
    const response = await makeRequest(token, payload);
    
    // Set outputs using GitHub Actions output format
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      fs.appendFileSync(outputFile, `response=${JSON.stringify(response.body)}\n`);
      fs.appendFileSync(outputFile, `success=${response.success}\n`);
    }

    if (response.success) {
      console.log('✅ Notification sent successfully!');
    } else {
      console.log('❌ Failed to send notification');
      console.error(`HTTP Status: ${response.statusCode}`);
      process.exit(1);
    }

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function makeRequest(token, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: 'api.pocketalert.app',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Token': token,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`HTTP Status: ${res.statusCode}`);
        console.log(`Response: ${body}`);
        
        resolve({
          statusCode: res.statusCode,
          body: body,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

sendNotification();
